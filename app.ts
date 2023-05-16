import dotenv from 'dotenv';
import path from 'path';

// NODE_ENV 에 맞게 env 파일 설정.
if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV);
  dotenv.config({ path : path.join(__dirname, '/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  dotenv.config({ path : path.join(__dirname, '/.env.local') });
} else {
  console.error('Not defined process.env.NODE_ENV');
  throw new Error('Not defined process.env.NODE_ENV');
}

import Koa from 'koa';
import cors from '@koa/cors';
import cookie from 'koa-cookie';
import { ioCookieParser } from 'socket.io-cookies-parser';
import http from 'http';
import { Server } from 'socket.io';
import { koaBody } from 'koa-body';
import { setCookie } from 'koa-cookies';
import { SocketType } from './src/socket/socketio.types';
import TestEvent from './src/socket/testHandlers';

const app = new Koa();
app.use(cookie());
app.use(koaBody());

const server = http.createServer(app.callback());
const io = new Server(server, {
  cors : {
    origin : '*',
    methods : ['GET', 'HEAD', 'POST', 'OPTIONS'],
    credentials : true,
  },
  cookie : true,
});

app.use(setCookie('testKey', 'testValue'));
app.use(ctx => console.log('ctx cookie : ', ctx.headers.cookie));

const onConnection = (socket: SocketType) => {
  console.log('id : ', socket.id);
  TestEvent(io, socket);
};

io.use(ioCookieParser).on('connection', onConnection);

server.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
