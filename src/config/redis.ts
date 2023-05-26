import { SampleMessage } from '../socket/socketio.types';

const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;

import * as redis from 'redis';

// Instantiate the Redis client
const redisClient = redis.createClient({
  url : `redis://${REDISHOST}:${REDISPORT}`,
});

// Connect to the Redis server
(async () => {
  await redisClient.connect();
})();

// Insert new messages into the Redis cache
async function addMessageToCache (roomName: string, msg: SampleMessage) {
  // Check for current cache
  let room = await getRoomFromCache(roomName);
  if (room) {
    // Update old room
    room.messages.push(msg);
  } else {
    // Create a new room
    room = {
      room : roomName,
      messages : [msg],
    };
  }
  await redisClient.set(roomName, JSON.stringify(room));
  // Insert message to the database as well
  await addMessageToDb(room);
}

// Query Redis for messages for a specific room
// If not in Redis, query the database
async function getRoomFromCache (roomName: string) {
  if (!(await redisClient.exists(roomName))) {
    const room = getRoomFromDatabase(roomName);
    if (room) {
      await redisClient.set(roomName, JSON.stringify(room));
    }
  }
  return JSON.parse(await redisClient.get(roomName) as string);
}

// In-memory database example -
// Production applications should use a persistent database such as Firestore
const messageDb = [
  {
    room : 'my-room',
    messages : [
      { user : 'Chris', text : 'Hi!' },
      { user : 'Chris', text : 'How are you!?' },
      { user : 'Megan', text : 'Doing well!' },
      { user : 'Chris', text : 'That\'s great' },
    ],
  },
  {
    room : 'new-room',
    messages : [
      { user : 'Chris', text : 'The project is due tomorrow' },
      { user : 'Chris', text : 'I am wrapping up the final pieces' },
      { user : 'Chris', text : 'Are you ready for the presentation' },
      { user : 'Megan', text : 'Of course!' },
    ],
  },
];

// Insert messages into the example database for long term storage
async function addMessageToDb (data: { room: string, messages: { user: string, text: string }[] }) {
  const room = messageDb.find(messages => messages.room === data.room);
  if (room) {
    // Update room in database
    Object.assign(room, data);
  } else {
    // Create new room in database
    messageDb.push(data);
  }
}

// Query the example database for messages for a specific room
function getRoomFromDatabase (roomName: string) {
  return messageDb.find(messages => messages.room === roomName);
}

export { redisClient, getRoomFromCache, addMessageToCache };
