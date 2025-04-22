import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, './proto/chat.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const CLIENT_COUNT = 1000;
const MESSAGES_PER_CLIENT = 10000;

const start = Date.now();
let totalMessages = 0;

function runClient(id: number) {
  return new Promise<void>((resolve) => {
    const client = new proto.chat.ChatService('localhost:50051', grpc.credentials.createInsecure());
    let sent = 0;

    function sendNext() {
      if (sent >= MESSAGES_PER_CLIENT) return resolve();
      const content = `client-${id}-msg-${sent}`;
      client.SendMessage({ username: `client-${id}`, content }, (err: any, response: any) => {
        if (err) console.error(err);
        sent++;
        totalMessages++;
        sendNext();
      });
    }

    sendNext();
  });
}

async function main() {
  const clients = [];
  for (let i = 0; i < CLIENT_COUNT; i++) {
    clients.push(runClient(i));
  }
  await Promise.all(clients);
  const duration = (Date.now() - start) / 1000;
  console.log(`\n=== gRPC Load Test ===`);
  console.log(`Clients: ${CLIENT_COUNT}`);
  console.log(`Messages/client: ${MESSAGES_PER_CLIENT}`);
  console.log(`Total messages: ${totalMessages}`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Avg msg/sec: ${(totalMessages / duration).toFixed(2)}`);
}

main();