import { Socket } from 'socket.io';

import { User } from './data';

export interface DecoratedSocket extends Socket {
    user: User
}

export type Acknowledgement<T> = (args: T | Error) => void;

