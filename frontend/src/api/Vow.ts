import { Vow } from 'ts';
import { isError } from './Error';

export function isResolved(vow: Vow<any>): boolean {
    return vow && !isError(vow) && vow !== 'FETCHING';
}