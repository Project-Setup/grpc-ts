import { credentials } from '@grpc/grpc-js';

import { BookServiceClient } from '../proto/book_grpc_pb';
import { GetBookRequest, GetBookViaAuthor, Book } from '../proto/book_pb';

class OneBookServiceClient {
  public host: string;
  public port: number;
  public client: BookServiceClient;
  constructor({ host = 'localhost', port = 50051 } = {}) {
    this.host = host;
    this.port = port;
    this.client = new BookServiceClient(
      `${this.host}:${this.port}`,
      credentials.createInsecure()
    );
  }

  public getBook = (isbn: number): Promise<Book.AsObject> =>
    new Promise((resolve, reject) => {
      const request = new GetBookRequest();
      request.setIsbn(isbn);
      console.info('[getBook] Request: ', request.toObject());

      this.client.getBook(request, (err, book) => {
        if (err !== null) {
          reject(err);
          return;
        }
        console.info('[getBook] Book: ', book.toObject());
        resolve(book.toObject());
      });
    });

  public getBooks = (): Promise<Book.AsObject[]> =>
    new Promise((resolve, reject) => {
      const stream = this.client.getBooks();

      const books: Book.AsObject[] = [];
      stream.on('data', (book: Book) => {
        console.info('[getBooks] Book: ', book.toObject());
        books.push(book.toObject());
      });
      stream.on('end', () => {
        console.info('[getBooks] Done.');
        resolve(books);
      });

      stream.on('error', (err) => {
        reject(err);
      });

      [...Array(10).keys()].forEach((_, i) => {
        const req = new GetBookRequest();
        req.setIsbn(i);
        console.info('[getBooks] Request: ', req.toObject());
        stream.write(req);
      });

      stream.end();
    });

  public getBooksViaAuthor = (author: string): Promise<Book.AsObject[]> =>
    new Promise((resolve, reject) => {
      const request = new GetBookViaAuthor();
      request.setAuthor(author);
      console.info('[getBookViaAuthor] Request: ', request.toObject());

      const stream = this.client.getBooksViaAuthor(request);
      const books: Book.AsObject[] = [];
      stream.on('data', (book: Book) => {
        console.info('[getBooksViaAuthor] Book: ', book.toObject());
        books.push(book.toObject());
      });
      stream.on('end', () => {
        console.info('[getBooksViaAuthor] Done');
        resolve(books);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });

  public getGreatestBook = (): Promise<Book.AsObject> =>
    new Promise((resolve, reject) => {
      const stream = this.client.getGreatestBook((err, book: Book) => {
        if (err != null) {
          reject(err);
        }
        console.info('[getGreatestBook] Book: ', book.toObject());
        resolve(book.toObject());
      });

      [...Array(10).keys()].forEach((_, i) => {
        const req = new GetBookRequest();
        req.setIsbn(i);
        console.info('[getGreatestBook] Request: ', req.toObject());
        stream.write(req);
      });
      stream.end();
    });
}

export default OneBookServiceClient;
