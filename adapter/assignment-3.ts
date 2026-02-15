import previous_assignment from './assignment-2'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

async function listBooks (filters?: Filter[]): Promise<Book[]> {
  const query = filters?.map(({ from, to, name, author }, index) => {
    let result = ''
    if (typeof from === 'number')
      result += `&filters[${index}][from]=${from}`
    if (typeof to === 'number')
      result += `&filters[${index}][to]=${to}`
    if (typeof name === 'string' && name.trim().length > 0)
      result += `&filters[${index}][name]=${name.trim()}`
    if (typeof author === 'string' && author.trim().length > 0)
      result += `&filters[${index}][author]=${author.trim()}`
    return result
  }).join('&') ?? ''

  const res=await fetch(`http://localhost:3000/books?${query}`)
  if (res.ok) {
    return (await res.json() as Book[])
  } else {
    console.warn(await res.text())
    throw new Error(`fetching "${query}" failed.`)
  }
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}