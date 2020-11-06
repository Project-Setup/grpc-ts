import OneBookServiceClient from './OneBookServiceClient';

const main = async ({
  host,
  port,
}: { host?: string; port?: number } = {}): Promise<void> => {
  const client = new OneBookServiceClient({ host, port });
  console.log('first call: ', await client.getBook(11));
  console.log('second call: ', await client.getBooks());
  console.log('third call: ', await client.getBooksViaAuthor('SomeAuthor'));
  console.log('fourth call: ', await client.getGreatestBook());
};

if (require.main === module) {
  main();
}

export default main;
