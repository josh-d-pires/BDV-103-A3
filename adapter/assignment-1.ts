import { resourceLimits } from 'worker_threads';
import books from './../mcmasteful-book-list.json';

export interface Book {
  name: string,
  author: string,
  description: string,
  price: number,
  image: string,
};

async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {
  const query = filters?.map(({ from, to }, index) => {
    let result = ''
    if (typeof from === 'number') {
      result += `&filters[${index}][from]=${from}`
    }
    if (typeof to === 'number') {
      result += `&filters[${index}][to]=${to}`
    }
    return result
  }).join('&') ?? ''

  let res=await fetch(`http://localhost:3000/books?${query}`)
  if (res.ok) {
    return (await res.json() as Book[])
  } else {
    console.warn(await res.text())
    throw new Error(`fetching "${query}" failed.`)
  }
}
const assignment = "assignment-1";

export default {
  assignment,
  listBooks
};