import { Vow } from 'store/types';

export function isResolved(vow: Vow<any>): boolean {
    return !(!vow || vow === Error || vow === 'FETCHING');
}