/**
@brief program that solves the New York Times Spelling Bee game.
    Given a list of letters and a target letter, find all the valid words
    that can be created that include the target letter. Letters can be reused
    as frequently as needed

    If no target chosen, include all words and all possible words are valid 
    because an empty string/empty target can be considered to be in all words

    If the minimum word length is the same or greater than the number of letters
    provided to use, the scoring will still award a bonus for a panagram 
    (ex. with letters="act", target="c", the score would be 1 + PanagramBonus
    for the word "cat" even though it is only the minimum number of letters)


Note: Words and letters are compared in uppercase 
(have this built in so no user issues)

@references NYT Spelling Bee Game
@author Em Nam
@date 04-23-2024
*/

/**
 * @todo hidden class for select target when no letters are entered yet
 @todo highlight chosen target word by adding or removing the class target
 @todo get letters from the input box when click find words or enter in the text input
 @todo get and store the letters in an array
 @todo create new DOM html elements for each letter upon any change in text field
 @todo limit text field to a certain number of letters?
 @todo get and store the target letter from the selection
 @todo fix width of input sections when resize screen

 @todo optimize search dictionary in sections and cut out words that don't 
start with one of the letters
@todo create a ui
@todo create automated testing, more testing ex
@todo put toUpperCase() in the same spot for dictionary and for letter arr, target (put as soon as it is read in)
@todo display does not reset and words just get added if form submitted multiple times in a row (need a reset function before display)
@todo put the firstBy, ThenBy code into module?
 */

const MIN_WORD_LENGTH = 3;
const PANAGRAM_BONUS = 7;

/*** Copyright 2020 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
!(function (n, t) {
    "function" == typeof define && define.amd
        ? define([], t)
        : "object" == typeof exports
        ? (module.exports = t())
        : (n.firstBy = t());
})(this, function () {
    function s(n) {
        return n;
    }
    function y(n) {
        return "string" == typeof n ? n.toLowerCase() : n;
    }
    function p(n, t) {
        var e,
            i,
            o,
            r,
            f,
            u = "function" == typeof this && !this.firstBy && this,
            c =
                ((t = "object" == typeof (t = t) ? t : { direction: t }),
                "function" != typeof (e = n) &&
                    ((i = e),
                    (e = function (n) {
                        return n[i] || "";
                    })),
                1 === e.length &&
                    ((o = e),
                    (r = t.ignoreCase ? y : s),
                    (f =
                        t.cmp ||
                        function (n, t) {
                            return n < t ? -1 : t < n ? 1 : 0;
                        }),
                    (e = function (n, t) {
                        return f(r(o(n)), r(o(t)));
                    })),
                t.direction in { "-1": "", desc: "" }
                    ? function (n, t) {
                          return -e(n, t);
                      }
                    : e),
            t = u
                ? function (n, t) {
                      return u(n, t) || c(n, t);
                  }
                : c;
        return (t.thenBy = p), t;
    }
    return (p.firstBy = p);
});
//End

//for reading in text file:
// var firstBy = require("thenby"); //same issue with importing module fs
// const filesystem = require("fs");
//should store file server side and then access http req?
// import * as fs from "./fs";
const dictionary = readDictionary("assets/dictionary.txt");
const dict = document.getElementById("dict");
// console.log(dictionary);
//end reading in text file

const letterInput = document.getElementById("letter-input");
const findWordsBtn = document.getElementById("find-words-btn");
const inputForm = document.getElementById("inputs-form");
const wordListDisplayEl = document.getElementById("word-list-display");

inputForm.addEventListener("submit", findWords);

/**
 * Must convert letters to uppercase when read in
 * @param {*} e
 */
function findWords(e) {
    e.preventDefault();
    console.log("finding words");
    console.log(letterInput.value.toUpperCase());
    let letters = letterInput.value.toUpperCase();
    let target = ""; //placeholder until target functionality
    //miniDicct will be replaced with read in text file
    const wordsWithTarget = generateAllWordsWithTarget(
        letters,
        miniDict,
        target
    );
    console.log(wordsWithTarget);

    const valid = instantiateAllValidWords(wordsWithTarget, letters);
    valid.sort(firstBy(compareByWord).thenBy(compareByScore));
    // valid.sort(firstBy(compareByWord));
    // valid.sort(compareByWord);

    console.log(valid);
    console.log(`size valid: ${valid.length}`);
    console.log(`size init: ${wordsWithTarget.length}`);

    //this will be redundant probably?, use in the display funct to mark (Is In conditional)
    const panagrams = returnAllPanagrams(valid);
    console.log(panagrams);

    console.log("displaying words:");
    displayWords(valid);
}

/**
 * @param {*} validWordList 
 */
function displayWords(validWordList) {
    let currLen = validWordList[0].numLetters + 1;
    for (let i = 0; i < validWordList.length; i++) {
        if (currLen != validWordList[i].numLetters){
            //create a new section if word length decreases
            currLen = validWordList[i].numLetters;
            const newTerm = document.createElement("dt");
            newTerm.innerText = `${currLen} Letter Words:`;
            wordListDisplayEl.appendChild(newTerm);
        }
        const currWord = validWordList[i];
        let str = "";

        const newWord = document.createElement("dd");
        str = str + currWord.word + ` (${currWord.score}) `;
        if (currWord.isPanagram) {
            str = str + " * ";
        }
        newWord.innerText = str;
        wordListDisplayEl.appendChild(newWord);
    }
}

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
 * comparison function that sorts in desc order with the highest score first
 * @param {*} a first ValidWord
 * @param {*} b second ValidWord
 * @returns negative if the second word length lower, postive if second word is
        a longer length, 0 if both words have the same length
 */
function compareByLength(a, b) {
    return b.numLetters - a.numLetters;
}

/**
 * comparison function that sorts in desc order with the highest score first
 * @param {*} a first ValidWord
 * @param {*} b second ValidWord
 * @returns negative if the second word scores lower, postive if second word is
        a higher score, 0 if both words have the same score
 */
function compareByWord(a, b) {
    return a.word - b.word;
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
 * Calculate the score earned for a given word. A minimum letter word is 1 point
        Otherwise a word gets the number of points based on it's length. A
        Panagram gets bonus points
 * @param {*} word string that is being scored
 * @param {*} isPanagram boolean if the word is a panagram or not
 * @returns int that represents number of points earned
 */
function calcScore(word, isPanagram) {
    const len = word.length;
    let lenPoints = 0;
    if (len < MIN_WORD_LENGTH) {
        lenPoints = 0;
    } else if (len == MIN_WORD_LENGTH) {
        lenPoints = 1;
    } else {
        lenPoints = len;
    }

    return lenPoints + PANAGRAM_BONUS * isPanagram;
}

/**
 * returns if a given word is considered a panagram and uses all of the given
 *      letters, 
    assumes that the word and letters are in a matching case
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
 * assumes that each word is deliniated by a newline
 * @param {*} file name of the path/file that is being read in
 * @returns an array that stores all of the words in the file in lowercase
 */
function readDictionary(file) {
    sendXMLHttpRequest("GET", file, null, (response) => {
        // dict.innerText = response.toString().toUpperCase().split("\n");
        return response.toString().toUpperCase().split("\n");
    });
}

function sendXMLHttpRequest(type, url, data, callback) {
    var newRequest = new XMLHttpRequest();
    newRequest.open(type, url, true);
    newRequest.send(data);
    newRequest.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            callback(this.response);
        }
    };
}

/**
 * for each word in the dictionary, determine if it is a valid word to create
 *      and generate and return an array of these words. Valid created words
 *      must be made of only the given letters. Letters can be reused as many times
 *      as per NYT Spelling Bee rules. The valid created words must also contain
 *      the target letter at least once, 
    assumes that the word and letters are in a matching case
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
//************ TEST BACKGROUND LOGIC/WORD FINDING FUNCTIONS ***************//
//*************************************************************************//

// const letters = ["R", "O", "C", "K", "G", "I", "N"];
// const target = "O";
// const letters = ["N", "M", "T", "A", "L", "B", "U"];
// const target = "U";
// const letters = ["T", "O", "L", "B", "K", "I", "N"];
// const target = "B";
// const miniLetters = ["c", "a", "t"];
// const miniTarget = "a";

const miniDict = [
    "ACT",
    "CAT",
    "CATTY",
    "CT",
    "FALSE",
    "BLACNK",
    "ACTION",
    "TATA",
    "TACT",
];

// const wordsTargetMini = generateAllWordsWithTarget(
//     miniLetters,
//     miniDict,
//     miniTarget
// );
// console.log("Words with target");
// console.log(wordsTargetMini);

// const wordsTarget = generateAllWordsWithTarget(letters, dictionary, target);
// console.log(wordsTarget);

// const valid = instantiateAllValidWords(wordsTarget, letters);
// valid.sort(compareByScore);
// console.log(valid);
// console.log(`size valid: ${valid.length}`);
// console.log(`size init: ${wordsTarget.length}`);

// const panagrams = returnAllPanagrams(valid);
// console.log(panagrams);

//*************************************************************************//
//************ END TEST BACKGROUND LOGIC/WORD FINDING FUNCT ***************//
//*************************************************************************//

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
