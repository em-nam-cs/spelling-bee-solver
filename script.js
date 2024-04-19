/**
@brief

@todo use a larger legit ditionary
@todo optimize search dictionary in sections and cut out words that don't start with one
of the letters
@todo filter out words that are too short
@todo get rid of print statements
@todo create a ui


@references NYT Spelling Bee Game
@author Em Nam
@date 04-16-2024
*/

const letters = ["c", "a", "t"];
const target = "a";
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

// generateAllWordsResult(letters, miniDict);
const words = generateAllWords(letters, miniDict);
console.log("All words:");
console.log(words);
const wordsTarget = generateAllWordsWithTarget(letters, miniDict, target);
console.log("Words with target");
console.log(wordsTarget);

function generateAllWordsResult(letters, dict) {
    for (let i = 0; i < dict.length; i++) {
        let result = checkWord(letters, dict[i]);
        console.log(`${i}: word checked ${dict[i]} is ${result}`);
    }
}

function generateAllWordsWithTarget(letters, dict, target) {
    const words = [];
    for (let i = 0; i < dict.length; i++) {
        console.log(`checking word ${dict[i]}`);
        if (checkWordWithTarget(letters, dict[i], target, false)) {
            console.log(`${i}: word checked ${dict[i]}`);
            words.push(dict[i]);
        }
    }
    return words;
}

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

// valid initially false
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