import assignment1 from "./assignment-1";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters)
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    // TODO: Implement this function to create or update a book via the API
    //
    // Requirements:
    // - If the book has an id, send a PUT request to update the existing book
    //   URL: http://localhost:3000/books/{id}
    // - If the book does not have an id, send a POST request to create a new book
    //   URL: http://localhost:3000/books
    // - Send the book data as JSON in the request body
    // - On success, return the book's id from the response
    // - On failure, throw an Error with a descriptive message
    //
    // Hints:
    // - Use the fetch API to make HTTP requests
    // - Set the 'Content-Type' header to 'application/json'
    // - Use JSON.stringify() to convert the book object to a JSON string
    // - Check result.ok to determine if the request was successful
    // - Parse the response with result.json() to get the id

    throw new Error("Not implemented");
}

async function removeBook(bookId: BookID): Promise<void> {
    // TODO: Implement this function to delete a book via the API
    //
    // Requirements:
    // - Send a DELETE request to http://localhost:3000/books/{bookId}
    // - On success (status 200 or 204), return without throwing
    // - On failure, throw an Error with a descriptive message
    //
    // Hints:
    // - Use the fetch API with method: 'DELETE'
    // - A successful delete typically returns status 204 (No Content)
    // - Check result.ok or result.status to determine success

    throw new Error("Not implemented");
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};
