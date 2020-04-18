import { Vow } from 'ts';
import { isError } from './Error';

export function isResolved(vow: Vow<any>): boolean {
    return vow && !isError(vow) && vow !== 'FETCHING';
}

export function dependOnVow<T>(vow: Vow<T>, onNotYetFetching: () => any, onFetching: () => any, onError: (err: Error) => any, onResolved: (res: T) => any) {
    if (!vow) {
        return onNotYetFetching();
    } else if (vow === 'FETCHING') {
        return onFetching();
    } else if (isError(vow)) {
        return onError(vow as unknown as Error);
    } else {
        return onResolved(vow as unknown as T);
    }
}

export function lazyDependOnVow<T>(vow: Vow<T>, onFetching: () => any, onError: (err: Error) => any, onResolved: (res: T) => any) {
    if (!vow) {
        return onFetching();
    } else if (vow === 'FETCHING') {
        return onFetching();
    } else if (isError(vow)) {
        return onError(vow as unknown as Error);
    } else {
        return onResolved(vow as unknown as T);
    }
}