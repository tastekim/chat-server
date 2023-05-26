import { Io, SocketType, Payload } from './socketio.types';
// import { client } from '../config/redis';

export default (io: Io, socket: SocketType) => {
  const roomMessage = (payload: Payload, done: any) => {
    console.log(`${socket.id} sending : ${payload.message}`);
    console.log(io.sockets.adapter.rooms);
    console.log(io.sockets.adapter.sids);
    const { sockets : { adapter : { rooms, sids } } } = io;
    const result: any = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        result.push(key);
      }
    });
    console.log(result);
    io.in('testRoom').emit('room:message', payload);
    done(payload.message);
  };

  const enterRoom = async (payload: Payload) => {
    console.log(`${socket.id} entering : testRoom`);
    socket.join(`${payload.roomId!}`);
  };

  const leaveRoom = () => {
    console.log(`${socket.id} leaving : testRoom`);
    socket.leave('testRoom');
  };

  const sendMessage = (payload: any, done: any) => {
    console.log(`${socket.id} sending : ${payload.message}`);
    io.emit('nps:message', payload);
    done(payload);
  };

  const setUserInfo = async (payload: any) => {
    console.log(`${socket.id}'s info : ${payload}`);
    socket.data.user = payload;
  };

  socket.on('room:message', roomMessage);
  socket.on('room:enter', enterRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('nsp:message', sendMessage);
  socket.on('user:register', setUserInfo);
};