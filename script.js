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

// const letters = ["r", "o", "c", "k", "g", "i", "n"];
// const target = "o";
const letters = ["t", "o", "l", "b", "k", "i", "n"];
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

const wordsTargetMini = generateAllWordsWithTarget(letters, miniDict, target);
const wordsTarget = generateAllWordsWithTarget(letters, dictionary, target);
console.log("Words with target");
console.log(wordsTargetMini);
console.log(wordsTarget);

const panagrams = markAllPanagrams(wordsTarget, letters);
console.log(panagrams);

const valid = instantiateAllValidWords(wordsTarget, letters);
console.log(valid);
console.log(`size valid: ${valid.length}`);
console.log(`size init: ${wordsTarget.length}`);

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
 * for each word that is possible to be created, create a new ValidWord object
        that stores information about the word (the string, if panagram, length
        and the score)
 * @param {*} wordList list of words that are able to be created 
 * @param {*} letters array of letters that can be used
 * @returns an array where each index contains a ValidWord object
 */
function instantiateAllValidWords(wordList, letters) {
    const validWords = [];
    for (let i = 0; i < wordList.length; i++) {
        validWords.push(
            new ValidWord(
                wordList[i],
                checkWordPanagram(wordList[i], letters),
                wordList[i].length,
                calcScore(wordList[i])
            )
        );
    }
    return validWords;
}

function calcScore(word) {
    return 1;
}

//re-write this using the properties of the ValidWords object
function markAllPanagrams(wordList, letters) {
    const panagrams = [];
    for (let i = 0; i < wordList.length; i++) {
        if (checkWordPanagram(wordList[i], letters)) {
            panagrams.push(wordList[i]);
        }
    }
    return panagrams;
}

/**
 * returns if a given word is considered a panagram and uses all of the given
 *      letters
 * @param {*} word string, word that is being checked
 * @param {*} letters array of letters that need to appear in word
 * @returns boolean, true if all the letters are in the word, false otherwise
 */
function checkWordPanagram(word, letters) {
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
