import Router from '@koa/router';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';

const deleteRouter = new Router();

// Delete a book by ID
deleteRouter.delete('/books/:id', async (ctx) => {
  try {
    const db=getDatabase(),
          id=ctx.params.id
    if (!ObjectId.isValid(id)) {
      ctx.status=400
      ctx.body={error:'invalid id'}
      return
    }
    const res=await db.collection('books').deleteOne(
      {_id:new ObjectId(id)}
    )
    if (res.deletedCount==0) {
      ctx.status=404
      ctx.body={error:`${id} was not found`}
      return
    }
    ctx.status=200
    ctx.body={id:id}
  } catch (err) {
    ctx.status=500
    ctx.body={error:`delete failed: ${err}`}
  }
    // TODO: Implement DELETE /books/:id endpoint to remove a book
    //
    // Requirements:
    // - Get the id from ctx.params
    // - Validate that id is a valid ObjectId format
    //   - If invalid, return status 400 with { error: 'Invalid book ID format' }
    // - Delete the book from the 'books' collection using deleteOne()
    // - If no document was deleted (deletedCount === 0), return status 404
    //   with { error: 'Book not found' }
    // - On success, return status 204 (No Content) with no body
    // - Handle errors with status 500 and { error: "message" }
    //
    // Hints:
    // - Use ctx.params.id to get the URL parameter
    // - Use ObjectId.isValid() to validate the id format
    // - Use new ObjectId(id) to convert string to ObjectId for the query
    // - Use db.collection('books').deleteOne({ _id: new ObjectId(id) })
    // - Check result.deletedCount to see if a document was actually deleted

    // ctx.status = 501;
    // ctx.body = { error: 'DELETE /books/:id not implemented' };
});

export default deleteRouter;
