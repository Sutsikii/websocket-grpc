import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, './proto/chat.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

function sendMessage(call: any, callback: any) {
  console.log(`[${call.request.username}] ${call.request.content}`);
  callback(null, { status: 'received' });
}

function main() {
  const server = new grpc.Server();
  server.addService(proto.chat.ChatService.service, { SendMessage: sendMessage });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server listening on port 50051');
    server.start();
  });
}

main();