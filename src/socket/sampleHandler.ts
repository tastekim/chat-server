import { Io, SocketType, SamplePayload } from './socketio.types';
import { addUser, deleteUser, getUser } from '../config/users';
import { addMessageToCache, getRoomFromCache } from '../config/redis';

export default (io: Io, socket: SocketType) => {
  const signin = async ({ user, room }: SamplePayload, callback: any) => {
    // Record socket ID to user's name and chat room
    addUser(socket.id, user, room);
    // Call join to subscribe the socket to a given channel
    socket.join(room);
    // Emit notification event
    socket.in(room).emit('notification', {
      title : 'Someone\'s here',
      description : `${user} just entered the room`,
    });
    // Retrieve room's message history or return null
    const messages = await getRoomFromCache(room);
    // Use the callback to respond with the room's message history
    // Callbacks are more commonly used for event listeners than promises
    callback(null, messages);
  };
  const updateSocketId = async ({ user, room }: SamplePayload) => {
    addUser(socket.id, user, room);
    socket.join(room);
  };
  const sendMessage = async (message: string, callback: any) => {
    // Retrieve user's name and chat room  from socket ID
    const { user, room } = getUser(socket.id);
    if (room) {
      const msg = { user, text : message };
      // Push message to clients in chat room
      io.in(room).emit('message', msg);
      await addMessageToCache(room, msg);
      callback();
    } else {
      callback('User session not found.');
    }
  };
  const disconnect = () => {
    // Remove socket ID from list
    const { user, room } = deleteUser(socket.id);
    if (user) {
      io.in(room).emit('notification', {
        title : 'Someone just left',
        description : `${user} just left the room`,
      });
    }
  };

  socket.on('signin', signin);
  socket.on('updateSocketId', updateSocketId);
  socket.on('sendMessage', sendMessage);
  socket.on('disconnect', disconnect);
};