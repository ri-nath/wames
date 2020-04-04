import { Vow } from 'store/types';
import {isError} from 'util/Error';

export function isResolved(vow: Vow<any>): boolean {
    return vow && !isError(vow) && vow !== 'FETCHING';
}