import { Message } from '@/types/chat';
import { createServer } from 'http'
import next from 'next'
import { Server } from "socket.io";

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()


app.prepare().then(() => {

  const httpServer = createServer(handle);

  const io = new Server(httpServer, { cors: { origin: '*' } });

if (!io.listenerCount("connection")) {
  io.on("connection", (socket) => {
    console.log('user connected: ', socket.id)

    socket.on('join-room', ({ roomId, userId, username }) => {
      if (socket.rooms.has(roomId)) {
        console.log('already in room', { roomId, userId });
        return;
      }

      socket.join(roomId);
      io.to(roomId).emit('user_joined', { roomId, userId, username });

      console.log('user joined room', { roomId, userId });
    });


    socket.on('send-message', ({roomId, message}) => {
      io.to(roomId).emit('messageSent', { roomId, message }) 
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  });
}
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });


  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
    }`
  )
})



app.prepare().then(() => {

});