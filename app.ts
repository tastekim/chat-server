import Koa from 'koa';
// import cors from '@koa/cors';
import http from 'http';
// import { createClient } from './src/config/redis';
import { Server } from 'socket.io';
import { koaBody } from 'koa-body';
import { redisClient } from './src/config/redis';
import { SocketType } from './src/socket/socketio.types';
import { createAdapter } from '@socket.io/redis-adapter';
import TestEvent from './src/socket/testHandlers';
import SampleEvent from './src/socket/sampleHandler';

const app = new Koa();

app.use(koaBody());

app.use(ctx => {
  ctx.response.body = 'connected.';
});

const server = http.createServer(app.callback());
const io = new Server(server, {
  cors : {
    origin : '*',
    methods : ['GET', 'HEAD', 'POST', 'OPTIONS'],
    credentials : true,
  },
  cookie : true,
});

const subClient = redisClient.duplicate();

io.adapter(createAdapter(redisClient, subClient));

// Add error handlers
redisClient.on('error', (err: Error) => {
  console.error(err.message);
});

subClient.on('error', (err: Error) => {
  console.error(err.message);
});

const onConnection = async (socket: SocketType) => {
  console.log('id : ', socket.id);
  TestEvent(io, socket);
  SampleEvent(io, socket);
};

io.on('connection', onConnection);

export { server };
