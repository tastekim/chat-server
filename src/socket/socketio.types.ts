import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export type Io = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
