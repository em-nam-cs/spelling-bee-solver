/**
@brief program that solves the New York Times Spelling Bee game.
    Given a list of letters and a target letter, find all the valid words
    that can be created that include the target letter. Letters can be reused
    as frequently as needed

    If no target chosen, include all words and all possible words are valid 
    because an empty string/empty target can be considered to be in all words


Note: Words and letters are compared in uppercase 
(have this built in so no user issues)

@todo optimize search dictionary in sections and cut out words that don't 
start with one of the letters
@todo create a ui
@todo create automated testing, more testing ex

@references NYT Spelling Bee Game
@author Em Nam
@date 04-23-2024
*/

const filesystem = require("fs");
const MIN_WORD_LENGTH = 4;
const PANAGRAM_BONUS = 7;

// const letters = ["R", "O", "C", "K", "G", "I", "N"];
// const target = "O";
const letters = ["T", "O", "L", "B", "K", "I", "N"];
const target = "B";
const miniDict = [
    "act",
    "cat",
    "tact",
    "catty",
    "ct",
    "false",
    "blank",
    "action",
    "tata",
];
const dictionary = readDictionary("assets/dictionary.txt");

const wordsTargetMini = generateAllWordsWithTarget(letters, miniDict, target);
const wordsTarget = generateAllWordsWithTarget(letters, dictionary, target);
console.log("Words with target");
console.log(wordsTargetMini);
console.log(wordsTarget);

const valid = instantiateAllValidWords(wordsTarget, letters);
console.log(valid);
valid.sort(compareByScore);
console.log(valid);
console.log(`size valid: ${valid.length}`);
console.log(`size init: ${wordsTarget.length}`);

valid.sort(compareByScore);

const panagrams = returnAllPanagrams(valid, letters);
console.log(panagrams);

/**
 * Constructor for a ValidWord object, which is an object that is a word
 *      that can be created using the given letters
 * @param {*} word string that is the word created
 * @param {*} isPanagram boolean true if word is panagram (uses all letters)
 * @param {*} numLetters int length of the word
 * @param {*} score int score for submitting word
 */
function ValidWord(word, isPanagram, numLetters, score) {
    this.word = word;
    this.isPanagram = isPanagram;
    this.numLetters = numLetters;
    this.score = score;
}

/**
 * comparison function that sorts in desc order with the highest score first
 * @param {*} a first ValidWord
 * @param {*} b second ValidWord
 * @returns negative if the second word scores lower, postive if second word is
        a higher score, 0 if both words have the same score
 */
function compareByScore(a, b) {
    return b.score - a.score;
}

/**
 * for each word that is possible to be created, create a new ValidWord object
        that stores information about the word (the string, if panagram, length
        and the score). Based on NYT, a valid word must be at least the 
        MIN_WROD_LENGTH 
 * @param {*} wordList list of words that are able to be created 
 * @param {*} letters array of letters that can be used
 * @returns an array where each index contains a ValidWord object
 */
function instantiateAllValidWords(wordList, letters) {
    const validWords = [];
    for (let i = 0; i < wordList.length; i++) {
        if (wordList[i].length >= MIN_WORD_LENGTH) {
            let panagramStatus = checkIsPanagram(wordList[i], letters);
            validWords.push(
                new ValidWord(
                    wordList[i],
                    panagramStatus,
                    wordList[i].length,
                    calcScore(wordList[i], panagramStatus)
                )
            );
        }
    }
    return validWords;
}

/**
 * find and return a list of all the panagrams from a given wordList of 
        ValidWords
 * @param {*} wordList list of words being checked if panagrams
 * @returns an array of ValidWord objects that are panagrams
 */
function returnAllPanagrams(wordList) {
    const panagrams = [];
    for (let i = 0; i < wordList.length; i++) {
        if (wordList[i].isPanagram) {
            panagrams.push(wordList[i]);
        }
    }
    return panagrams;
}

/**
 * sort ValidWord list based on a specified criteria (Panagrams at the top, 
        highest scoring, length) (IS THIS NECCESSARY BECAUSE THE PANAGRAM
        BONUS IS SO OP AND THE SCORE IS ESSENTIALLY THE LENGTH)
 * @param {*} words 
 * @returns 
 */
function sortWords(words) {
    
}

/**
 * Calculate the score earned for a given word. A minimum letter word is 1 point
        Otherwise a word gets the number of points based on it's length. A
        Panagram gets bonus points
 * @param {*} word string that is being scored
 * @param {*} isPanagram boolean if the word is a panagram or not
 * @returns int that represents number of points earned
 */
function calcScore(word, isPanagram) {
    const len = word.length;
    if (len < MIN_WORD_LENGTH) {
        return 0;
    } else if (len == MIN_WORD_LENGTH) {
        return 1;
    } else {
        return len + PANAGRAM_BONUS * isPanagram;
    }
}

/**
 * returns if a given word is considered a panagram and uses all of the given
 *      letters
 * @param {*} word string, word that is being checked
 * @param {*} letters array of letters that need to appear in word
 * @returns boolean, true if all the letters are in the word, false otherwise
 */
function checkIsPanagram(word, letters) {
    for (let i = 0; i < letters.length; i++) {
        if (!word.includes(letters[i])) {
            return false;
        }
    }
    return true;
}

/**
 * reads a list of words from a text file and returns array
 *      assume that each word is deliniated by a newline
 * @param {*} file name of the path/file that is being read in
 * @returns an array that stores all of the words in the file in lowercase
 */
function readDictionary(file) {
    return filesystem.readFileSync(file).toString().toUpperCase().split("\n");
}

/**
 * for each word in the dictionary, determine if it is a valid word to create
 *      and generate and return an array of these words. Valid created words
 *      must be made of only the given letters. Letters can be reused as many times
 *      as per NYT Spelling Bee rules. The valid created words must also contain
 *      the target letter at least once
 * @param {*} letters array of available letters
 * @param {*} dict array of possible valid words
 * @param {*} target the letter that must appear in the word
 * @returns
 */
function generateAllWordsWithTarget(letters, dict, target) {
    const words = [];
    for (let i = 0; i < dict.length; i++) {
        if (checkWordWithTarget(letters, dict[i], target, false)) {
            words.push(dict[i]);
        }
    }
    return words;
}

/**
 * Determine if the word is a valid word to create using the letters and
 *      given target.Valid created words must be made of only the given letters.
 *      Letters can be reused as many times as per NYT Spelling Bee rules.
 *      The valid created words must also contain
 *      the target letter at least once
 * @param {*} letters array of available letters
 * @param {*} word string of a word that is being checked if it can be created
 * @param {*} target the letter that must appear in the word
 * @param {*} valid boolean that is initially false until the target letter is
 *      used in the word
 * @returns
 */
function checkWordWithTarget(letters, word, target, valid) {
    if (word == "") {
        return valid;
    } else if (letters.includes(word[0])) {
        if (word[0] == target || target === "") {
            //if the target is in the word, it is now valid
            valid = true;
        }
        return checkWordWithTarget(letters, word.slice(1), target, valid);
    } else {
        return false;
    }
}

//*************************************************************************//
//********* GENERATE AND CHECK FOR ALL WORDS, DISREGARDS TARGET ***********//
//*************************************************************************//

// generateAllWordsResult(letters, miniDict);
// const words = generateAllWords(letters, miniDict);
// console.log("All words:");
// console.log(words);

/**
 * return an array of all the words in the dict that are able to made 
        created using the letters 
 * @param {*} letters letters available to be used
 * @param {*} dict list of valid words being checked
 * @returns array of words that can be created
 */
function generateAllWords(letters, dict) {
    const words = [];
    for (let i = 0; i < dict.length; i++) {
        if (checkWord(letters, dict[i])) {
            words.push(dict[i]);
        }
    }
    return words;
}

function generateAllWordsResult(letters, dict) {
    for (let i = 0; i < dict.length; i++) {
        let result = checkWord(letters, dict[i]);
        console.log(`${i}: word checked ${dict[i]} is ${result}`);
    }
}

/**
 * determines if a word can be created with the given letters
 *      letters are allowed to be reused as many times as desired

 * @param {*} letters letters available to be used in the word
 * @param {*} word target word being created
 * @returns true if a single word can be created with the letters given
        otherwise returns false
 */
function checkWord(letters, word) {
    if (word == "") {
        return true;
    } else if (letters.includes(word[0])) {
        return checkWord(letters, word.slice(1));
    } else {
        return false;
    }
}
