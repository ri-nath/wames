import Words from "an-array-of-english-words";

export const IS_DEV = true;

export const WORDS = Words.filter(word => word.length > 2);

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DESELECTOR = '!';

export const SERVER_ENDPOINT = IS_DEV ?
    'http://192.168.1.160:3000' :
    'https://word-games-server.herokuapp.com';

