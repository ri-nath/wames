"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log(...to_log) {
    console.log(new Date().toUTCString() + ':', ...to_log);
}
exports.log = log;
function isError(error) {
    return error &&
        error.stack &&
        error.message &&
        typeof error.stack === 'string' &&
        typeof error.message === 'string';
}
exports.isError = isError;
//# sourceMappingURL=misc.js.map