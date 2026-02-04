import Router from '@koa/router';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';

const createRouter = new Router();

interface BookInput {
    id?: string;
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateBookInput(body: any): { valid: boolean; error?: string; book?: BookInput } {
    // TODO: Implement input validation for book data
    //
    // Requirements:
  console.log(body)
    // - Validate that body is a non-null object
    if (!body || typeof body!= 'object') 
      return { valid:false, error:"body is not an object" }

    // - Validate that 'name' is a non-empty string
    if (typeof body.name!='string'||body.name.trim()=='') 
      return { valid:false, error:"name is not valid" }

    // - Validate that 'author' is a non-empty string
    if (typeof body.author!='string'||body.author.trim()=='') 
      return { valid:false, error:"author is not valid" }

    // - Validate that 'description' is a string
    if (typeof body.description!='string'||body.description.trim()=='') 
      return { valid:false, error:"description is not valid" }

    // - Validate that 'price' is a non-negative number (not NaN)
    if (typeof body.price!='number'||isNaN(body.price)||body.price<0) 
      return { valid:false, error:"price is not valid" }

    // - Validate that 'image' is a string
    if (typeof body.image!='string') 
      return { valid:false, error:"image is not valid" }

    // - Return { valid: false, error: "descriptive message" } for invalid input
    // - Return { valid: true, book: { ... } } for valid input
    return {
      valid: true,
      book: body
    }

    //
    // Hints:
    // - Use typeof to check types
    // - Use string.trim() to check for empty strings
    // - Use isNaN() to check for NaN values
    // - The 'id' field is optional and should be passed through if present

    // return { valid: false, error: 'Validation not implemented' };
}

// Create a new book
createRouter.post('/books', async (ctx) => {
  try {
    // TODO: Implement POST /books endpoint to create a new book
    //
    // Requirements:
    // - Validate the request body using validateBookInput()
    const test=validateBookInput(ctx.request.body)

    // - If validation fails, return status 400 with { error: "message" }
    if (!test.valid) {
      ctx.status=400
      ctx.body={error:test.error}
      return
    }

    const book=test.book,
          db=getDatabase()

    if (book?.id) {
      // - If book.id is provided:
      //   - Validate that it's a valid ObjectId format
      //   - Use updateOne with upsert: true to create/update the book
      //   - Return status 200 with { id: book.id }
      if (!ObjectId.isValid(book.id)) {
        ctx.status=400
        ctx.body={error:'invalid id'}
        return
      }
      await db.collection('books').updateOne(
        {_id:new ObjectId(book.id)},
        {$set:{
          name:book.name,
          author:book.author,
          description:book.description,
          price:book.price,
          image:book.image
        }},
        {upsert:true}
      )
      ctx.status=200
      ctx.body={id:book.id}
    } else {
    // - If book.id is not provided:
    //   - Use insertOne to create a new book
    //   - Return status 201 with { id: insertedId.toString() }
    // - Handle errors with status 500 and { error: "message" }
      const res=await db.collection('books').insertOne({
        name:book?.name,
        author:book?.author,
        description:book?.description,
        price:book?.price,
        image:book?.image
      })
      ctx.status=201
      ctx.body={id:res.insertedId.toString()}
    }

  } catch (err) {
    ctx.status=500
    ctx.body={error:`create/update failed: ${err}`}
  }
    //
    // Hints:
    // - Use getDatabase() to get the database instance
    // - Use ObjectId.isValid() to validate ObjectId format
    // - Use new ObjectId(id) to convert string to ObjectId
    // - Access the 'books' collection with db.collection('books')
});

// Update an existing book
createRouter.put('/books/:id', async (ctx) => {
  try {
    const test=validateBookInput(ctx.request.body)
    if (!test.valid) {
      ctx.status=400
      ctx.body={error:test.error}
      return
    }
    const book=test.book,
          db=getDatabase(),
          id=ctx.params.id
      if (book) {
        if (!ObjectId.isValid(id)) {
          ctx.status=400
          ctx.body={error:'invalid id'}
          return
        }
        const res=await db.collection('books').updateOne(
          {_id:new ObjectId(id)},
          {$set:{
            name:book.name,
            author:book.author,
            description:book.description,
            price:book.price,
            image:book.image
          }}
        )
        if (res.matchedCount==0) {
          ctx.status=404
          ctx.body={error:`${book.id} was not found`}
          return
        }
        ctx.status=200
        ctx.body={id:book.id}
      }
  } catch (err) {
    ctx.status=500
    ctx.body={error:`update failed: ${err}`}
  }
});

export default createRouter;
