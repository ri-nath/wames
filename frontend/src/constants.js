import Words from 'an-array-of-english-words';

export const WORDS = Words.filter(word => word.length > 2);

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DESELECTOR = '!';

export const SERVER_ENDPOINT = __DEV__ ?
    'http://192.168.1.160:3000' :
    'https://wames-dev.herokuapp.com';

