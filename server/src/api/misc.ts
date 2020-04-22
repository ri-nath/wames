export function log(...to_log: any[]) {
    console.log(new Date().toUTCString() + ':', ...to_log);
}

