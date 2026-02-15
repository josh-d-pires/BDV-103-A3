/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, type Db, type Collection } from 'mongodb'
import { type Book } from './adapter/assignment-1'//'./types'

const uri = (global as any).MONGO_URI as string ?? 'mongodb://mongo'

export const client = new MongoClient(uri)

export interface BookDatabaseAccessor {
  database: Db,
  books: Collection<Book>
}

export function getBookDatabase(): BookDatabaseAccessor {
  // If we aren't testing, we use a fixed database name
  // If testing, create a random database name for isolation
  const database = client.db(
    (global as any).MONGO_URI !== undefined
      ? Math.floor(Math.random() * 100000).toPrecision()
      : 'database-name'
  )
  const books = database.collection<Book>('books')
  return {
    database,
    books
  }
}