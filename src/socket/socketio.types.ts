import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export type Io = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;

export interface Payload {
  message?: string;
  roomName?: string;
  mid?: number;
  roomId?: number;
  uid: string;
}

export interface SamplePayload {
  user: string;
  room: string;
}
export interface SampleMessage {
  user: string;
  text: string;
}