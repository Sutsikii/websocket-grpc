# WebSocket vs gRPC Performance Comparison

## Quick Start

```bash
# Start all services
docker-compose up

# Start only WebSocket services
docker-compose up websocket-server websocket-client

# Start only gRPC services
docker-compose up grpc-server grpc-client
```

> **Note:** Logs will be available in the client containers.

## Overview

This project compares WebSocket and gRPC performance for real-time chat applications, specifically testing which protocol is more efficient for handling 100,000 messages in JavaScript client-side applications.

## Protocol Overview

### WebSocket
- Lightweight bidirectional protocol
- Native browser support
- Fast text/binary data transmission
- Very low latency, minimal network overhead
- Ideal for web real-time applications

### gRPC
- Google's RPC framework
- Uses HTTP/2 + Protobuf for optimized communication
- High performance for server-to-server communication
- Requires gRPC-web proxy for web clients
- gRPC-web doesn't support true bidirectional streaming

## Benchmark Results

### Test Conditions
- 1000 simultaneous clients
- 100 messages per client
- Total: 100,000 messages

### WebSocket Results
```
2025-04-27 11:29:35 Starting load test with 1000 clients...
2025-04-27 11:29:40 

=== Load Test Report ===
Total clients: 1000
Messages per client: 100
Total messages sent: 100000
Failed messages: 62823
Average latency: 5.70 ms
Total time: 5.58 sec
```

**Analysis:**
- Very fast: 5.58 seconds total
- Extremely low latency: 5.70 ms average
- High failure rate (62.8%) due to server saturation or poor management

### gRPC Results
```
2025-04-27 11:29:35 Starting load test with 1000 clients...
2025-04-27 11:29:58 

=== Load Test Report ===
Total clients: 1000
Messages per client: 100
Total messages sent: 100000
Failed messages: 599
Average latency: 332.52 ms
Total time: 23.74 sec
```

**Analysis:**
- Very reliable: 99.4% success rate
- Higher latency: 332.52 ms average
- 4x longer total duration than WebSocket
- Not optimized for ultra-real-time web chat

## Comparison Summary

| Metric | WebSocket | gRPC (gRPC-web) |
|--------|-----------|-----------------|
| Total Time | 5.58 sec | 23.74 sec |
| Average Latency | 5.70 ms | 332.52 ms |
| Failure Rate | 62.8% | 0.6% |
| Best Use Case | Pure web real-time applications | Backend or secure communications with strong typing |

## Conclusion

- **WebSocket** is the optimal choice for raw speed in JavaScript chat applications, provided the server is optimized to prevent message loss.
- **gRPC** is better suited for reliable, high-volume backend communications.