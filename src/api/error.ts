import { WamesError } from '../ts';

export function isError(error: any): boolean {
    return error &&
        error.stack &&
        error.message &&
        typeof error.stack === 'string' &&
        typeof error.message === 'string';
}

export function createError(type: 'FAILED' | 'REJECTED', message: string): WamesError {
    return {
            type: type,
            message: message
    }
}

export function isAnyError(t) {
    return isError(t) || isWamesError(t);
}

export function isWamesError(t) {
    return ['FAILED', 'REJECTED'].includes(t['type']);
}

export function pipeToWamesError(t: Error | WamesError): WamesError {
    return isError(t) ? createError('FAILED', (t as Error).name + ': ' + (t as Error).message) : t as WamesError;
}