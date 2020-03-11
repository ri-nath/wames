import Words from "an-array-of-english-words";

export const WORDS = Words.filter(word => word.length > 2);

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const VOWELS = 'AEIOU';
export const TILES = 8;
export const MIN_VOWELS = TILES / 4;

export const DESELECTOR = '!';
