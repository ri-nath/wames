export function isError(error: any): boolean {
    return error &&
        error.stack &&
        error.message &&
        typeof error.stack === 'string' &&
        typeof error.message === 'string';
}

export function isAnyError(t: any) {
    return isError(t) || isWamesError(t);
}

export function isWamesError(t: any) {
    return ['FAILED', 'REJECTED'].includes(t['type']);
}