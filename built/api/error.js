"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isError(error) {
    return error &&
        error.stack &&
        error.message &&
        typeof error.stack === 'string' &&
        typeof error.message === 'string';
}
exports.isError = isError;
function createError(type, message) {
    return {
        type: type,
        message: message
    };
}
exports.createError = createError;
function isAnyError(t) {
    return isError(t) || isWamesError(t);
}
exports.isAnyError = isAnyError;
function isWamesError(t) {
    return ['FAILED', 'REJECTED'].includes(t['type']);
}
exports.isWamesError = isWamesError;
function pipeToWamesError(t) {
    return isError(t) ? createError('FAILED', t.name + ': ' + t.message) : t;
}
exports.pipeToWamesError = pipeToWamesError;
//# sourceMappingURL=error.js.map