import { Socket } from 'socket.io';

import { Hesitant } from './error';
import { User } from './data';

export interface DecoratedSocket extends Socket {
    user: User
}

export type Acknowledgement<T> = (args: Hesitant<T>) => void;

