import {
  Server as GrpcServer,
  ServerCredentials,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';

import { BookServiceService } from '../proto/book_grpc_pb';
import BookServiceImplemenation from './BookServiceImplemenation';

const startServer = async ({ host = 'localhost', port = 50051 } = {}): Promise<
  void
> => {
  const server = new GrpcServer();
  server.addService(
    BookServiceService,
    (new BookServiceImplemenation() as unknown) as UntypedServiceImplementation
  );
  server.bindAsync(
    `${host}:${port}`,
    ServerCredentials.createInsecure(),
    async (err, realPort) => {
      if (err) {
        throw err;
      }
      server.start();
      console.log(`Server started, listening on ${realPort}`);
    }
  );
};

if (require.main === module) {
  startServer();
}

export default startServer;
