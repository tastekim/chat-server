import { Client } from 'redis-om';

export const client = new Client();

export const createClient = async () => {
  console.log('createClient');
  if (!client.isOpen()) {
    await client.open();
    console.log('Client is open');
  }
};