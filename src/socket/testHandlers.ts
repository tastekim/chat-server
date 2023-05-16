import { Io, SocketType } from './socketio.types';

export default (io: Io, socket: SocketType) => {
  const roomMessage = (message: string, payload:any, cb: any) => {
    console.log(`${socket.id} sending : ${message}`);
    console.log(typeof payload);
    io.in('testRoom').emit('room:message', `${socket.id} : ${message}`);
    cb(message);
  };

  const enterRoom = () => {
    console.log(`${socket.id} entering : testRoom`);
    const cookie = socket.request.headers['set-cookie'] || {};
    console.log('opts : ', socket.request.headers.cookies);
    console.log('cookie : ', cookie);
    socket.join('testRoom');
  };

  const leaveRoom = () => {
    console.log(`${socket.id} leaving : testRoom`);
    socket.leave('testRoom');
  };

  const sendMessage = (message: string) => {
    console.log(`${socket.id} sending : ${message}`);
    io.emit('nps:message', message);
  };

  socket.on('room:message', roomMessage);
  socket.on('room:enter', enterRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('nsp:message', sendMessage);
};