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

function validateBookInput(body: any): { valid: boolean; error?: string; book?: BookInput } {
    // TODO: Implement input validation for book data
    //
    // Requirements:
    // - Validate that body is a non-null object
    // - Validate that 'name' is a non-empty string
    // - Validate that 'author' is a non-empty string
    // - Validate that 'description' is a string
    // - Validate that 'price' is a non-negative number (not NaN)
    // - Validate that 'image' is a string
    // - Return { valid: false, error: "descriptive message" } for invalid input
    // - Return { valid: true, book: { ... } } for valid input
    //
    // Hints:
    // - Use typeof to check types
    // - Use string.trim() to check for empty strings
    // - Use isNaN() to check for NaN values
    // - The 'id' field is optional and should be passed through if present

    return { valid: false, error: 'Validation not implemented' };
}

// Create a new book
createRouter.post('/books', async (ctx) => {
    // TODO: Implement POST /books endpoint to create a new book
    //
    // Requirements:
    // - Validate the request body using validateBookInput()
    // - If validation fails, return status 400 with { error: "message" }
    // - If book.id is provided:
    //   - Validate that it's a valid ObjectId format
    //   - Use updateOne with upsert: true to create/update the book
    //   - Return status 200 with { id: book.id }
    // - If book.id is not provided:
    //   - Use insertOne to create a new book
    //   - Return status 201 with { id: insertedId.toString() }
    // - Handle errors with status 500 and { error: "message" }
    //
    // Hints:
    // - Use getDatabase() to get the database instance
    // - Use ObjectId.isValid() to validate ObjectId format
    // - Use new ObjectId(id) to convert string to ObjectId
    // - Access the 'books' collection with db.collection('books')

    ctx.status = 501;
    ctx.body = { error: 'POST /books not implemented' };
});

// Update an existing book
createRouter.put('/books/:id', async (ctx) => {
    // TODO: Implement PUT /books/:id endpoint to update an existing book
    //
    // Requirements:
    // - Get the id from ctx.params
    // - Validate that id is a valid ObjectId format (return 400 if not)
    // - Validate the request body using validateBookInput()
    // - If validation fails, return status 400 with { error: "message" }
    // - Use updateOne to update the book (without upsert)
    // - If no document matched (matchedCount === 0), return status 404
    // - On success, return status 200 with { id: id }
    // - Handle errors with status 500 and { error: "message" }
    //
    // Hints:
    // - Use ctx.params.id to get the URL parameter
    // - Use db.collection('books').updateOne() with $set operator
    // - Check result.matchedCount to see if a document was found

    ctx.status = 501;
    ctx.body = { error: 'PUT /books/:id not implemented' };
});

export default createRouter;
