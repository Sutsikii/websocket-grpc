import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('chat message', (msg) => {
    console.log('message', msg)
    io.emit('chat message', msg) 
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(3002, () => {
  console.log('Socket.IO server listening on port 3002')
})
