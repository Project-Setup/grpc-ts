/* eslint-disable @typescript-eslint/no-var-requires */
require('@babel/register')({ extensions: ['.js', '.ts'] });
// import all other files after the babel hook
// const app = require('./app');

process.on('uncaughtException', (err) => {
  console.error(`process on uncaughtException error:`);
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error(`process on unhandledRejection error:`);
  console.error(err);
});

const grpcMode = process.env.GRPC_MODE;

if (grpcMode === 'server') {
  const { default: startServer } = require('./server/index');
  startServer({ host: process.env.HOST, port: process.env.PORT });
} else if (grpcMode === 'client') {
  const { default: main } = require('./client/index');
  main({ host: process.env.HOST, port: process.env.PORT });
}
