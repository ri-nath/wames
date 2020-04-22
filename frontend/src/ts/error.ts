export interface WamesError {
    type: 'FAILED' | 'REJECTED',
    message: string,
}

export type Hesitant<T> = T | WamesError;
export type Acknowledgement<T> = (args: Hesitant<T>) => void;