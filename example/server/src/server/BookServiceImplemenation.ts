import {
  ServerUnaryCall,
  sendUnaryData,
  ServerDuplexStream,
  ServerWritableStream,
  ServerReadableStream,
} from '@grpc/grpc-js';

import { IBookServiceServer } from '../proto/book_grpc_pb';
import { Book, GetBookRequest, GetBookViaAuthor } from '../proto/book_pb';

class BookServiceImplemenation implements IBookServiceServer {
  public async getBook(
    call: ServerUnaryCall<GetBookRequest, Book>,
    callback: sendUnaryData<Book>
  ): Promise<void> {
    const book = new Book();
    book.setIsbn(call.request?.getIsbn() ?? 0);
    book.setTitle('DefaultBook');
    book.setAuthor('DefaultAuthor');

    console.info('[getBook] Done: ', book.toObject());
    callback(null, book);
  }

  public async getBooks(
    call: ServerDuplexStream<GetBookRequest, Book>
  ): Promise<void> {
    call.on('data', (request: GetBookRequest) => {
      const reply = new Book();
      reply.setTitle(`Book ${request.getIsbn()}`);
      reply.setAuthor(`Author ${request.getIsbn()}`);
      reply.setIsbn(request.getIsbn());
      call.write(reply);
    });
    call.on('end', () => {
      console.info(`[getBooks] Done`);
      call.end();
    });
  }

  public async getBooksViaAuthor(
    call: ServerWritableStream<GetBookViaAuthor, Book>
  ): Promise<void> {
    console.info('[getBooksViaAuthor] Request: ', call.request?.toObject());
    [...Array(10).keys()].forEach((_, i) => {
      const reply = new Book();
      reply.setTitle(`Book ${i}`);
      reply.setAuthor(call.request?.getAuthor() ?? 'DefaultAuthor');
      reply.setIsbn(i);
      console.info('[getBooksViaAuthor] Write: ', reply.toObject());
      call.write(reply);
    });
    console.info('[getBooksViaAuthor] Done');
    call.end();
  }

  public async getGreatestBook(
    call: ServerReadableStream<GetBookRequest, Book>,
    callback: sendUnaryData<Book>
  ): Promise<void> {
    let lastOne: GetBookRequest;
    call.on('data', (request: GetBookRequest) => {
      console.info('[getGreatestBook] Request: ', request.toObject());
      lastOne = request;
    });
    call.on('end', () => {
      const reply = new Book();
      reply.setIsbn(lastOne.getIsbn());
      reply.setTitle('LastOne');
      reply.setAuthor('LastOne');
      console.info('[getGreatestBook] Done: ', reply.toObject());
      callback(null, reply);
    });
  }
}

export default BookServiceImplemenation;
