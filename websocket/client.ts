import { io } from "socket.io-client";

const SERVER_URL = "http://websocket-server:3002";
const TOTAL_CLIENTS = 1000;
const MESSAGES_PER_CLIENT = 100;

let totalMessages = 0;
let failedMessages = 0;
let latencies: number[] = [];

const runClient = async (id: number) => {
  return new Promise<void>((resolve) => {
    const socket = io(SERVER_URL, { transports: ["websocket"] });

    let sent = 0;

    socket.on("connect", () => {
      const sendMessage = () => {
        if (sent >= MESSAGES_PER_CLIENT) {
          socket.disconnect();
          return resolve();
        }

        const start = performance.now();
        const content = `client-${id}-message-${sent}`;

        socket.emit("chat message", content);
        sent++;

        socket.once("chat message", (data) => {
          const latency = performance.now() - start;
          latencies.push(latency);
          totalMessages++;
          sendMessage();
        });

        setTimeout(() => {
          failedMessages++;
          sendMessage();
        }, 2000);
      };

      sendMessage();
    });

    socket.on("connect_error", () => {
      failedMessages += MESSAGES_PER_CLIENT;
      resolve();
    });
  });
};

const main = async () => {
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
};

main();
