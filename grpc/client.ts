import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, './proto/chat.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const TOTAL_CLIENTS = 1000;
const MESSAGES_PER_CLIENT = 100;

let totalMessages = 0;
let failedMessages = 0;
let latencies: number[] = [];

function runClient(id: number) {
  return new Promise<void>((resolve) => {
    const client = new proto.chat.ChatService('grpc-server:50051', grpc.credentials.createInsecure());
    let sent = 0;

    function sendNext() {
      if (sent >= MESSAGES_PER_CLIENT) {
        return resolve();
      }

      const start = performance.now();
      const content = `client-${id}-message-${sent}`;

      const timeout = setTimeout(() => {
        failedMessages++;
        sent++;
        sendNext();
      }, 2000);

      client.SendMessage({ content }, (err: any, response: any) => {
        clearTimeout(timeout);
        if (err) {
          console.error(err);
          failedMessages++;
        } else {
          const latency = performance.now() - start;
          latencies.push(latency);
          totalMessages++;
        }
        sent++;
        sendNext();
      });
    }

    sendNext();
  });
}

async function main() {
  console.log(`Starting load test with ${TOTAL_CLIENTS} clients...`);
  const startTime = performance.now();

  const clients = [];
  for (let i = 0; i < TOTAL_CLIENTS; i++) {
    clients.push(runClient(i));
  }

  await Promise.all(clients);

  const totalTime = (performance.now() - startTime) / 1000;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  console.log(`\n=== Load Test Report ===`);
  console.log(`Total clients: ${TOTAL_CLIENTS}`);
  console.log(`Messages per client: ${MESSAGES_PER_CLIENT}`);
  console.log(`Total messages sent: ${totalMessages}`);
  console.log(`Failed messages: ${failedMessages}`);
  console.log(`Average latency: ${avgLatency.toFixed(2)} ms`);
  console.log(`Total time: ${totalTime.toFixed(2)} sec`);
}

main();