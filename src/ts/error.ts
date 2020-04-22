export interface WamesError {
    type: 'FAILED' | 'REJECTED',
    message: string,
}

export type Hesitant<T> = T | WamesError;