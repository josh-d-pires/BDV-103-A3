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
});

export default deleteRouter;
