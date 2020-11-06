import { credentials } from '@grpc/grpc-js';
import { promisify } from 'util';

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

  public getBook = async (isbn: number): Promise<Book.AsObject> => {
    const request = new GetBookRequest();
    request.setIsbn(isbn);
    console.info('[getBook] Request: ', request.toObject());

    const getBookAsync = promisify<GetBookRequest, Book>(
      this.client.getBook
    ).bind(this.client);

    return (await getBookAsync(request)).toObject();
  };

  public getBooks = async (): Promise<Book.AsObject[]> => {
    const stream = this.client.getBooks();

    [...Array(10).keys()].forEach((_, i) => {
      const req = new GetBookRequest();
      req.setIsbn(i);
      console.info('[getBooks] Request: ', req.toObject());
      stream.write(req);
    });

    stream.end();

    const books: Book.AsObject[] = [];
    try {
      for await (const book of stream) {
        const bookObject = (book as Book).toObject();
        console.info('[getBooks] Book: ', bookObject);
        books.push(bookObject);
      }
      return books;
    } catch (err) {
      throw err;
    }
  };

  public getBooksViaAuthor = async (
    author: string
  ): Promise<Book.AsObject[]> => {
    const request = new GetBookViaAuthor();
    request.setAuthor(author);
    console.info('[getBookViaAuthor] Request: ', request.toObject());

    const stream = this.client.getBooksViaAuthor(request);
    const books: Book.AsObject[] = [];
    try {
      for await (const book of stream) {
        const bookObject = (book as Book).toObject();
        console.info('[getBooksViaAuthor] Book: ', bookObject);
        books.push(bookObject);
      }
      return books;
    } catch (err) {
      throw err;
    }
  };

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
