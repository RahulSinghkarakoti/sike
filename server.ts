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
 

  io.on('connection', socket => {
    console.log('user connected: ', socket.id);

    /* 1.  declare the handlers ONCE per socket  */
    const onJoin = ({ roomId, userId, username }: { roomId: string; userId: string; username: string }) => {
      if (socket.rooms.has(roomId)) {
        console.log('already in room', { roomId, userId });
        return;
      }

      socket.join(roomId);
      io.to(roomId).emit('user_joined', { roomId, userId, username });

      console.log('user joined room', { roomId, userId });
    };
    const onMessage = ({ roomId, message }:{roomId:string,message:Message}) => {
      io.to(roomId).emit('messageSent', { roomId, message })
    };
    const onDisconnect = () => {
      console.log('user disconnected', socket.id);

      /* 2.  remove the listeners we added */
      socket.off('join-room', onJoin);
      socket.off('send-message', onMessage);
      socket.off('disconnect', onDisconnect); // not strictly required, but clean
    };

    /* 3.  attach them */
    socket.on('join-room', onJoin);
    socket.on('send-message', onMessage);
    socket.on('disconnect', onDisconnect);
  });

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