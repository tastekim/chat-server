import { Io, SocketType, Payload } from './socketio.types';

export default (io: Io, socket: SocketType) => {
  const roomMessage = (payload: Payload, done: any) => {
    console.log(`${socket.id} sending : ${payload.message}`);
    io.in('testRoom').emit('room:message', payload);
    done(payload.message);
  };

  const valifyRoom = (payload: Payload) => {
    const { sockets : { adapter : { rooms, sids } } } = io;
    const result: any = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        result.push(key);
      }
    });

    result.includes(payload.roomName);
  };

  const enterRoom = (payload: Payload) => {
    console.log(`${socket.id} entering : testRoom`);
    socket.join(`${payload.roomId!}`);
  };

  const leaveRoom = () => {
    console.log(`${socket.id} leaving : testRoom`);
    socket.leave('testRoom');
  };

  socket.on('room:message', roomMessage);
  socket.on('room:enter', enterRoom);
  socket.on('room:leave', leaveRoom);
};