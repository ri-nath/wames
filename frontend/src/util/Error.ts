export function isError(error: any): boolean {
    return error &&
           error.stack &&
           error.message &&
           typeof error.stack === 'string' &&
           typeof error.message === 'string';
}