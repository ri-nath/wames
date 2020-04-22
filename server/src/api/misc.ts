export function log(...to_log: any[]) {
    console.log(new Date().toUTCString() + ':', ...to_log);
}

export function isError(error: any): boolean {
    return error &&
        error.stack &&
        error.message &&
        typeof error.stack === 'string' &&
        typeof error.message === 'string';
}