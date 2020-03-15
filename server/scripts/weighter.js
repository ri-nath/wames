const words = require('an-array-of-english-words');

const filtered_words = words.filter(word => word.length > 2);

// 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
//     console.log('\'' + letter + '\': ' + 0 + ',');
// });

// const letters = {
//     'A': 0,
//     'B': 0,
//     'C': 0,
//     'D': 0,
//     'E': 0,
//     'F': 0,
//     'G': 0,
//     'H': 0,
//     'I': 0,
//     'J': 0,
//     'K': 0,
//     'L': 0,
//     'M': 0,
//     'N': 0,
//     'O': 0,
//     'P': 0,
//     'Q': 0,
//     'R': 0,
//     'S': 0,
//     'T': 0,
//     'U': 0,
//     'V': 0,
//     'W': 0,
//     'X': 0,
//     'Y': 0,
//     'Z': 0
// };
//
// words.forEach(word => {
//    const word_letters = word.split('');
//
//    word_letters.map(letter => letter.toUpperCase()).forEach(uppercase => {
//        letters[uppercase] = letters[uppercase] + 1;
//    })
// });
//
// console.log(letters);

// const letters ={
//     A: 195832,
//     B: 46410,
//     C: 102513,
//     D: 83935,
//     E: 286167,
//     F: 29721,
//     G: 69952,
//     H: 63210,
//     I: 231005,
//     J: 4102,
//     K: 22654,
//     L: 132826,
//     M: 73474,
//     N: 171212,
//     O: 169403,
//     P: 76416,
//     Q: 4200,
//     R: 176849,
//     S: 244618,
//     T: 166977,
//     U: 83479,
//     V: 23437,
//     W: 18657,
//     X: 7098,
//     Y: 41314,
//     Z: 12299
// };
//
// Object.keys(letters).forEach(letter => {
//     letters[letter] = Math.floor(letters[letter] / 2500) * 10;
// });
//
// console.log(letters);

const letters = {
    A: 780,
    B: 180,
    C: 410,
    D: 330,
    E: 1140,
    F: 110,
    G: 270,
    H: 250,
    I: 920,
    J: 10,
    K: 90,
    L: 530,
    M: 290,
    N: 680,
    O: 670,
    P: 300,
    Q: 10,
    R: 700,
    S: 970,
    T: 660,
    U: 330,
    V: 90,
    W: 70,
    X: 20,
    Y: 160,
    Z: 40
};

let letters_list = [];

Object.keys(letters).forEach(letter => {
   while (letters[letter] > 0) {
       letters_list.push(' \'' + letter + '\'');

       letters[letter] = letters[letter] - 10;
   }
});

console.log(letters_list);

require('clipboardy').writeSync(letters_list.toString());

