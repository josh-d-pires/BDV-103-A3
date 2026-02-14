import { test, expect } from '@playwright/test';
// import { BinaryOperatorToken } from 'typescript';
import { Book } from '../adapter/assignment-1';

const API_URL = 'http://localhost:3000';

/*test.*/describe('Books API', () => {
    let createdBookId: string;

    /*test.*/describe('GET /books', () => {
        test('should return an array of books', async ({ request }) => {
            const response = await request.get(`${API_URL}/books`);
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            const books = await response.json();
            expect(Array.isArray(books)).toBeTruthy();
        });
    });

    /*test.*/describe('POST /books', () => {
        test('should create a new book', async ({ request }) => {
            const newBook = {
                name: 'Test Book',
                author: 'Test Author',
                description: 'A test book description',
                price: 19.99,
                image: 'https://example.com/book.jpg'
            };

            const response = await request.post(`${API_URL}/books`, {
                data: newBook
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(201);
            const body = await response.json();
            expect(body.id).toBeDefined();
            createdBookId = body.id;
        });

        test('should return created book in list', async ({ request }) => {
            const response = await request.get(`${API_URL}/books`);
            const books = await response.json();
            const createdBook = books.find((b: Book) => b.id === createdBookId);
            expect(createdBook).toBeDefined();
            expect(createdBook.name).toBe('Test Book');
            expect(createdBook.author).toBe('Test Author');
        });

        test('should reject book with missing name', async ({ request }) => {
            const response = await request.post(`${API_URL}/books`, {
                data: {
                    author: 'Test Author',
                    description: 'Test',
                    price: 10,
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toContain('Name is required');
        });

        test('should reject book with missing author', async ({ request }) => {
            const response = await request.post(`${API_URL}/books`, {
                data: {
                    name: 'Test Book',
                    description: 'Test',
                    price: 10,
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toContain('Author is required');
        });

        test('should reject book with negative price', async ({ request }) => {
            const response = await request.post(`${API_URL}/books`, {
                data: {
                    name: 'Test Book',
                    author: 'Test Author',
                    description: 'Test',
                    price: -5,
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toContain('Price is required and must be a non-negative number');
        });

        test('should reject book with missing price', async ({ request }) => {
            const response = await request.post(`${API_URL}/books`, {
                data: {
                    name: 'Test Book',
                    author: 'Test Author',
                    description: 'Test',
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
        });
    });

    /*test.*/describe('PUT /books/:id', () => {
        test('should update an existing book', async ({ request }) => {
            const updatedBook = {
                name: 'Updated Book',
                author: 'Updated Author',
                description: 'An updated description',
                price: 29.99,
                image: 'https://example.com/updated.jpg'
            };

            const response = await request.put(`${API_URL}/books/${createdBookId}`, {
                data: updatedBook
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.id).toBe(createdBookId);
        });

        test('should return updated book in list', async ({ request }) => {
            const response = await request.get(`${API_URL}/books`);
            const books = await response.json();
            const updatedBook = books.find((b: Book) => b.id === createdBookId);
            expect(updatedBook).toBeDefined();
            expect(updatedBook.name).toBe('Updated Book');
            expect(updatedBook.author).toBe('Updated Author');
            expect(updatedBook.price).toBe(29.99);
        });

        test('should reject update with invalid ID format', async ({ request }) => {
            const response = await request.put(`${API_URL}/books/invalid-id`, {
                data: {
                    name: 'Test',
                    author: 'Test',
                    description: 'Test',
                    price: 10,
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toContain('Invalid book ID format');
        });

        test('should return 404 for non-existent book', async ({ request }) => {
            const response = await request.put(`${API_URL}/books/507f1f77bcf86cd799439011`, {
                data: {
                    name: 'Test',
                    author: 'Test',
                    description: 'Test',
                    price: 10,
                    image: 'test.jpg'
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(404);
            const body = await response.json();
            expect(body.error).toContain('Book not found');
        });
    });

    /*test.*/describe('DELETE /books/:id', () => {
        test('should reject delete with invalid ID format', async ({ request }) => {
            const response = await request.delete(`${API_URL}/books/invalid-id`);

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toContain('Invalid book ID format');
        });

        test('should return 404 for non-existent book', async ({ request }) => {
            const response = await request.delete(`${API_URL}/books/507f1f77bcf86cd799439011`);

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(404);
            const body = await response.json();
            expect(body.error).toContain('Book not found');
        });

        test('should delete an existing book', async ({ request }) => {
            const response = await request.delete(`${API_URL}/books/${createdBookId}`);

            expect(response.status()).toBe(204);
        });

        test('should not return deleted book in list', async ({ request }) => {
            const response = await request.get(`${API_URL}/books`);
            const books = await response.json();
            const deletedBook = books.find((b: Book) => b.id === createdBookId);
            expect(deletedBook).toBeUndefined();
        });
    });
});
