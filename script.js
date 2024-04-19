/**
@brief program that solves the New York Times Spelling Bee game.
    Given a list of letters and a target letter, find all the valid words
    that can be created that include the target letter. Letters can be reused
    as frequently as needed

Note: Words and letters are compared in lowercase (have this built in so no user issues)

@todo use a larger legit ditionary
@todo optimize search dictionary in sections and cut out words that don't start with one
of the letters
@todo filter out words that are too short (based on a variable)
@todo indicate the panagrams that use all letters
@todo get rid of print statements
@todo create a ui
@todo create automated testing, more testing ex




@references NYT Spelling Bee Game
@author Em Nam
@date 04-16-2024
*/

const filesystem = require("fs");

const letters = ["t", "o", "l", "k", "b", "i", "n"];
const target = "b";
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

const wordsTarget = generateAllWordsWithTarget(letters, miniDict, target);
const wordsTargetBig = generateAllWordsWithTarget(letters, dictionary, target);
console.log("Words with target");
console.log(wordsTarget);
console.log(wordsTargetBig);

/**
 * reads a list of words from a text file and returns array
 *      assume that each word is deliniated by a newline
 * @param {*} file name of the path/file that is being read in
 * @returns an array that stores all of the words in the file
 */
function readDictionary(file) {
    return filesystem.readFileSync(file).toString().toLowerCase().split("\n");
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
    // console.log(`${letters}, ${dict}, ${target}`);
    const words = [];
    for (let i = 0; i < dict.length; i++) {
        // console.log(`checking word ${dict[i]}`);
        if (checkWordWithTarget(letters, dict[i], target, false)) {
            // console.log(`${i}: word checked ${dict[i]}`);
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
        if (word[0] == target) {
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
