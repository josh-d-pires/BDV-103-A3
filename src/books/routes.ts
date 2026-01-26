import { z } from "zod";
import { ZodError } from "zod";
import { ObjectId } from "mongodb";
import createRouter from 'koa-zod-router';
import { Context } from 'koa';
import { book_collection } from "../db";

const router = createRouter();

/**
 * Zod schema to validate the body of a POST request
 */
const bookSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  author: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number()
});

/**
 * Zod schema to validate MongoDB ObjectId
 */
const objectIdSchema = z.string().refine(
  (val) => ObjectId.isValid(val),
  { message: "Invalid MongoDB ObjectId" }
);

type Book = z.infer<typeof bookSchema>;

/**
 * Zod schema to validate the `filters` query parameter.
 * - Accepts a JSON string representing an array of filter objects.
 * - Each object can contain optional `from` and/or `to` numbers.
 */
const filterSchema = z.object({
  filters: z
    .string()
    .optional()
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val ?? '[]');
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      },
      {
        message: 'Invalid JSON format for filters'
      }
    )
    .transform((val) => {
      try {
        const parsed = JSON.parse(val ?? '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })
    .refine(
      (arr): arr is Array<{ from?: number; to?: number }> =>
        arr.every(
          (filter) =>
            typeof filter === 'object' &&
            (filter.from === undefined || typeof filter.from === 'number') &&
            (filter.to === undefined || typeof filter.to === 'number')
        ),
      { message: 'invalid input' }
    )
});

function handleZodError(
  ctx: Context,
  error: ZodError,
  message = 'Invalid input'
) {
  ctx.status = 400;
  ctx.body = {
    error: message,
    details: error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message
    }))
  };
}

/**
 * GET /books
 * Fetches a list of books.
 * If `filters` query param is provided, it filters books by price range.
 * Example: /books?filters=[{"from":10,"to":25}]
 */
router.get('/books', async (ctx) => {
  try {
    const validatedQuery = filterSchema.safeParse(ctx.query);

    // safeParse returns a tuple with the parsed data and a boolean indicating success
    // so we can check the success property to see if the query is valid
    if (!validatedQuery.success) {
      ctx.status = 400;
      ctx.body = {
        error: `Failed to fetch books due to: ${validatedQuery.error.message}`
      };
      return;
    }

    const filters = validatedQuery.data.filters;
    const mongoQuery = filters?.length ? {
      $or: filters.flatMap(({ from, to }) => {
        const filter: { price: { $gte?: number, $lte?: number } } = { price: {} };
        if (from !== undefined) filter.price.$gte = from;
        if (to !== undefined) filter.price.$lte = to;
        return Object.keys(filter.price).length ? [filter] : [];
      })
    } : {};

    const book_list = await book_collection.find(mongoQuery).map(data => ({
      id: data._id.toHexString(),
      name: data.name,
      image: data.image,
      price: data.price,
      author: data.author,
      description: data.description
    })).toArray();

    console.log(`Found ${book_list.length} books matching filters: ${JSON.stringify(filters) || "No filters"}`);

    ctx.body = book_list;

  } catch (err) {
    if (err instanceof ZodError) return handleZodError(ctx, err);
    ctx.status = 400;
    ctx.body = {
      error: `Failed to fetch books due to: ${(err as Error).message}`
    };
  }
});

/**
 * GET /books/:id
 * Fetches a single book by its ID.
 */
router.get('/books/:id', async (ctx) => {
  try {
    const validatedId = objectIdSchema.safeParse(ctx.params.id);
    if (!validatedId.success) {
      ctx.status = 400;
      ctx.body = { error: validatedId.error.message };
      return;
    }

    const book = await book_collection.findOne({ _id: ObjectId.createFromHexString(validatedId.data) });
    if (book) {
      ctx.body = {
        id: book._id.toHexString(),
        name: book.name,
        author: book.author,
        description: book.description,
        price: book.price,
        image: book.image
      };
    } else {
      ctx.status = 404;
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
  }
});

/**
 * POST /books
 * Adds a new book or updates an existing one.
 * Expects a valid book object in the request body.
 */
router.post('/books', async (ctx) => {
  try {
    const parsed = bookSchema.parse(ctx.request.body);
    if (parsed.id) {
      const id = ObjectId.createFromHexString(parsed.id);
      // Update existing book
      const result = await book_collection.replaceOne(
        { _id: id },
        {
          name: parsed.name,
          author: parsed.author,
          price: parsed.price,
          description: parsed.description || "",
          image: parsed.image || ""
        });
      if (result.acknowledged && result.modifiedCount === 1) {
        ctx.body = { id };
        ctx.status = 201;
      } else {
        ctx.statusCode = 404;
      }
    } else {
      // Create new book
      const result = await book_collection.insertOne({
        name: parsed.name,
        author: parsed.author,
        description: parsed.description || "",
        price: parsed.price,
        image: parsed.image || ""
      });
      ctx.status = 201;
      ctx.body = { id: result.insertedId };
    }
  } catch (err) {
    if (err instanceof ZodError) return handleZodError(ctx, err);
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
  }
});

/**
 * DELETE /books/:id
 * Deletes a book with the given ID.
 */
router.delete('/books/:id', async (ctx) => {
  try {
    const validatedId = objectIdSchema.safeParse(ctx.params.id);
    if (!validatedId.success) {
      ctx.status = 400;
      ctx.body = { error: validatedId.error.message };
      return;
    }

    const result = await book_collection.deleteOne({ _id: ObjectId.createFromHexString(validatedId.data) });
    if (result.deletedCount === 1) {
      ctx.status = 204;
    } else {
      ctx.status = 404;
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
  }
});


export default router;
