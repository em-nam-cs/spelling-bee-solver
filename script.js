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
@date 04-30-2024
*/

/**
@todo create new DOM html elements for each letter upon any change in text field
    @todo: prevent duplicate letters from showing in targets
    @todo prevent space from adding to function or input
    @todo hidden class for "select target", when no letters are entered yet

@todo prevent spcaing from jumping when remove target and hide selection

@todo ON RESET, reset the input options too


@todo put toUpperCase() in the same spot for dictionary and for letter arr, target (put as soon as it is read in)
@todo highlight chosen target word by adding or removing the class target


@todo limit text field to a certain number of letters? (preent recursion from breaking) 
@todo fix width of input sections when resize screen
@todo optimize search dictionary in sections and cut out words that don't 
    start with one of the letters
@todo create automated testing, more testing ex
@todo put the firstBy, ThenBy code into module?
@todo let user choose how to sort
@todo change the heading based on what is being sorted first

*/

const MIN_WORD_LENGTH = 2;
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
const inputForm = document.getElementById("inputs-form");
const wordListDisplayEl = document.getElementById("word-list-display");
const resetBtn = document.getElementById("reset-btn");
const wordListTitleEl = document.getElementById("word-list-title");
const lineBreakEl = document.getElementById("line-break");
const targetBtnContainer = document.getElementById("target-btn-container");
const targetInputLabel = document.getElementById("target-input-label");
const targetErrorMsgDisplay = document.getElementById(
    "target-error-message-display"
);
const inputErrorMsgDisplay = document.getElementById(
    "input-error-message-display"
);

inputForm.addEventListener("submit", findWords);
resetBtn.addEventListener("click", reset); //eventually on reset, reset inputs too not just display
letterInput.addEventListener("input", handleLetterInput);

/**
 * clears the input and word display outputs, resets the screen to initial
 * status, with no letters, targets input or words found
 */
function reset() {
    clearWordListDisplay();
    clearInputDisplay();
}

/**
 * Set the target to the clicked input, remove previous target (if any)
 * @param {*} e the event where the click originated from (indicates new
        current target)
 */
function selectTarget(e) {
    console.log("CLICKED");

    //find previous target (if exists) and remove
    const prevTarget = document.getElementsByClassName("target");
    if (prevTarget[0]) {
        prevTarget[0].classList.remove("target");
    }

    //set newly clicked to target
    e.explicitOriginalTarget.classList.add("target");
}

/**
 * each time the text input of the letters is changed, read in the input and 
 * update the target options
 * to match the possible options for the target
 * prevent the user from entering invalid characters (nonletters) and from
 * entering duplicates

 * because cases when arrowkeys, cursor, highlighting change creates ambiguity
 * to the order and of which character is input/removed to the letters, read 
 * result of letterInput each change and fully update instead of 
 * only add/removing the single change
 */
function handleLetterInput() {
    console.log("handling letter input");

    readCleanInputLetters();

    //clear previous possible targets and then display all letters
    clearTargetDisplay();

    if (letters.length == 0) {
        targetInputLabel.classList.add("hidden");
    } else {
        targetInputLabel.classList.remove("hidden");
    }

    for (let i = 0; i < letters.length; i++) {
        const newLetter = document.createElement("input");
        newLetter.type = "button";
        newLetter.className = "target-input";
        newLetter.value = letters[i].toUpperCase();
        newLetter.addEventListener("click", selectTarget);
        targetBtnContainer.appendChild(newLetter);
    }
}

/**
 * read in the input text and make sure it only contains unique letters
 * set the input text to reflect the cleaned up version and display
 * error message if needed
 */
function readCleanInputLetters() {
    const input = letterInput.value; //read input
    const onlyLetters = input.replace(/[^a-z]/gim, ""); //remove non-alpha char
    letters = removeDuplicates(onlyLetters); //remove duplicates

    //if needed to remove a letter/char, display an err msg
    inputErrorMsgDisplay.classList.remove("hidden");
    if (onlyLetters != input) {
        inputErrorMsgDisplay.innerText = "Please enter a valid letter";
    } else if (letters != onlyLetters) {
        inputErrorMsgDisplay.innerText = "Please enter a unique letter";
    } else {
        inputErrorMsgDisplay.classList.add("hidden");
    }

    //update letter input to reflect only the valid input chars
    letterInput.value = letters;
}

/**
 * removes duplicate letters from a string
 *
 * @param {*} str input string that duplicates will be removed from
 * @returns the input str without duplicate letters (the letter order will be
 *      based on the first occurrence of each letter)
 */
function removeDuplicates(str) {
    console.log("removing duplicates");
    let noDuplicates = "";
    for (let i = 0; i < str.length; i++) {
        //if the previous letters already been typed, do not include it
        if (!noDuplicates.includes(str[i])) {
            noDuplicates = noDuplicates + str[i];
        }
    }
    return noDuplicates;
}

/**
 * Must convert letters to uppercase when read in
 * @param {*} e
 */
function findWords(e) {
    e.preventDefault();
    console.log("finding words");
    let letters = letterInput.value.toUpperCase();
    let target = "";
    let targetExists;

    try {
        target = document.getElementsByClassName("target")[0].value;
        targetExists = true;
    } catch (error) {
        target = "";
        targetExists = false;
        console.log(error.message);
    }

    const wordsWithTarget = generateAllWordsWithTarget(
        letters,
        miniDict, //miniDicct will be replaced with read in text file
        target
    );

    const valid = instantiateAllValidWords(wordsWithTarget, letters);
    valid.sort(
        firstBy(compareByLength).thenBy(compareByScore).thenBy(compareByWord)
    );

    //this will be redundant probably?, use in the display funct to mark (Is In conditional)
    //maybe if user wants to only display panagrams, or have them listed at the top
    const panagrams = returnAllPanagrams(valid);
    //end
    displayWords(valid, targetExists);
}

/**
 * @param {*} validWordList
 */
function displayWords(validWordList, targetExists) {
    console.log("displaying words:");

    inputErrorMsgDisplay.classList.add("hidden"); //clears input err msg because done inputting
    clearWordListDisplay(); //clears previous results

    //hides or displays the target error message
    if (targetExists) {
        targetErrorMsgDisplay.classList.add("hidden");
    } else {
        targetErrorMsgDisplay.classList.remove("hidden");
    }

    //display the title elements
    lineBreakEl.classList.remove("hidden");
    wordListTitleEl.classList.remove("hidden");

    //display heading if no valid words
    if (validWordList.length == 0) {
        const newHeading = document.createElement("h3");
        newHeading.innerText = "No Words Found";
        wordListDisplayEl.appendChild(newHeading);
        return;
    }

    //display all the words in the list
    let currLen = validWordList[0].numLetters + 1;
    for (let i = 0; i < validWordList.length; i++) {
        if (currLen != validWordList[i].numLetters) {
            //create a new section if word length changes
            currLen = validWordList[i].numLetters;
            const newTerm = document.createElement("dt");
            newTerm.innerText = `${currLen} Letter Words:`;
            wordListDisplayEl.appendChild(newTerm);
        }

        const newWord = document.createElement("dd");
        const currWord = validWordList[i];
        let str = currWord.word + ` (${currWord.score}) `;
        if (currWord.isPanagram) {
            str = str + " * ";
        }
        newWord.innerText = str;
        wordListDisplayEl.appendChild(newWord);
    }
}

/**
 * clear the input text and targets
 */
function clearInputDisplay() {
    inputErrorMsgDisplay.classList.add("hidden");
    letterInput.value = "";
    clearTargetDisplay();
}

/**
 * clears the target dislpay and removes the event handles for each target btn
 */
function clearTargetDisplay() {
    console.log("clearing target display");
    targetInputLabel.classList.add("hidden");
    while (targetBtnContainer.firstChild) {
        targetBtnContainer.removeChild(targetBtnContainer.lastChild);
        targetBtnContainer.lastChild = null; //garbage collect event handlers
    }
}

/**
 * removes all of the html elements in the wordListDisplay and hides the title
 * and error messages to clear the results from the display
 */
function clearWordListDisplay() {
    console.log("clearing word list display");
    lineBreakEl.classList.add("hidden");
    wordListTitleEl.classList.add("hidden");
    targetErrorMsgDisplay.classList.add("hidden");
    while (wordListDisplayEl.firstChild) {
        wordListDisplayEl.removeChild(wordListDisplayEl.lastChild);
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
    return a.word.localeCompare(b.word);
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
    "TAT",
    "CAT",
    "ACT",
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
