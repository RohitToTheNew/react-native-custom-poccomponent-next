
export const capitalize = (string = "") => { //jsUpperCasefirstCharacter
    let str = string.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeInWord = (str = "") => { //jsUpperCasefirstCharacterInWord
    // let str = string.toLowerCase();
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
};

export function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export const jsUcfirstAfterSpace = (string, splitText = ' ', jointText = ' ') => {
    if (string) {
        return string
            .toLowerCase()
            .split(splitText)?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(jointText);
    }
    return '';
}

export function usaFormatNumStr(num) {

    //console.log('num:', num);
    let value = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 12,345.67
    if (value == NaN) {
        value = '';
    }
    return value; // 12,345.67
}
export function replaceAll(str, find, replace) {
    var re = new RegExp(find, 'g');
    return str.replace(re, replace);
}

export function convertUrlToJson(str) {
    return JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

export function ID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
export function randomNumberWithoutDecimal() {
    return Math.random().toString(36).substr(2, 9);
}

export function firstChar(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return '';
}

export function firstWord(string) {
    if (string && string.trim() != '') {
        return string.split(' ')[0];
    }
    return '';
}

export function myRandomUniqueInts(quantity, min = 0, max, withPadStr = false) {
    // const set = new Set();
    // while (set.size < quantity) {
    //     if (withPadStr) {
    //         set.add(setLimitZero(`${Math.floor(Math.random() * max) + 1}`))
    //     } else {
    //         set.add(Math.floor(Math.random() * max) + 1)
    //     }

    // }
    // return Array.from(set);


    const set = new Set();
    // let min = min;
    //  Get the maximum value my getting the size of the
    //  array and subtracting by 1.
    let max1 = (max + 1);
    while (set.size < quantity) {
        if (withPadStr) {
            set.add(setLimitZero(`${Math.floor(Math.random() * (max1 - min)) + min}`))
        } else {
            set.add(Math.floor(Math.random() * (max1 - min)) + min)
        }

    }
    return Array.from(set);


    // var min = min;
    // //  Get the maximum value my getting the size of the
    // //  array and subtracting by 1.
    // var max = (max + 1);
    // let random = Math.floor(Math.random() * (max - min)) + min;
    // //Get a random integer between the min and max value.
    // return random == max ? max - 1 : random;
}
export function myRandomNonUniqueInts(quantity, min = 0, max, withPadStr = false) {
    const set = [];

    let max1 = (max + 1);
    while (set.length < quantity) {
        if (withPadStr) {
            // set.push(setLimitZero(`${Math.floor(Math.random() * max) + 1}`));
            set.push(setLimitZero(`${Math.floor(Math.random() * (max1 - min)) + min}`));
        } else {
            // set.push(Math.floor(Math.random() * max) + 1);
            set.push(Math.floor(Math.random() * (max1 - min)) + min);
        }

    }
    return set;
}

export function setLimitZero(str, limit = 2) {
    return str.padStart(limit, '0');
}

/**
 * Convert an integer to its words representation
 * 
 * @author McShaman (http://stackoverflow.com/users/788657/mcshaman)
 * @source http://stackoverflow.com/questions/14766951/convert-digits-into-words-with-javascript
 */
export function NumberToEnglish(mystr, isPaise = false, custom_join_character = '') {

    let n = mystr.toString().split('.')[0];

    var string = n.toString(),
        units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    var and = custom_join_character || 'and';

    /* Is number zero? */
    if (parseInt(string) === 0) {
        return 'Zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

        chunk = parseInt(chunks[i]);

        if (chunk) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split('').reverse()?.map(parseFloat);

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if ((word = scales[i])) {
                words.push(word);
            }

            /* Add unit word if array item exists */
            if ((word = units[ints[0]])) {
                words.push(word);
            }

            /* Add tens word if array item exists */
            if ((word = tens[ints[1]])) {
                words.push(word);
            }

            // /* Add 'and' string after units or tens integer if: */
            // if (ints[0] || ints[1]) {

            //     /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
            //     if (ints[2] || !i && chunksLen) {
            //         words.push(and);
            //     }

            // }

            /* Add hundreds word if array item exists */
            if ((word = units[ints[2]])) {
                words.push(word + ' hundred');
            }

        }

    }

    if (mystr.toString().includes('.')) {
        const paiseValue = NumberToEnglish(mystr.toString().split('.')[1], true);
        words.splice(0, 0, `Rupees ${paiseValue} Paise`);
    } else if (!isPaise) {
        words.splice(0, 0, `Rupees`);
    }

    return capitalizeInWord(words.reverse().join(' '));

}
/*----------Example
// one hundred and twenty three million four hundred and fifty six thousand seven hundred and eighty nine
NumberToEnglish(123456789);

// Use a custom separator (like , instead of "and")
// one hundred , twenty three million four hundred , fifty six thousand seven hundred , eighty nine
NumberToEnglish(123456789, ",");
*/

export function jsonCopy(data, defaultValue = null) {
    if (data == null) {
        return defaultValue;
    }
    return JSON.parse(JSON.stringify(data));
}

export function NumberToRoman(num) {
    if (typeof num !== 'number')
        return false;

    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman_num = "",
        i = 3;
    while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    return (Array(+digits.join("") + 1).join("M") + roman_num).toLowerCase();
}

export function convertThousandToK(value) {
    if (Number(value) != null && Number(value) >= 1000000) {
        return Number(value) != null && Number(value) >= 1000000 ? `${(value % 1000000) == 0 ? (value / 1000000) : (value / 1000000).toFixed(2)}` + "M" : (
            Number(value) != null ? `${value}` : '0'
        )
    } else if (Number(value) != null && Number(value) >= 1000) {
        return Number(value) != null && Number(value) >= 1000 ? `${(value % 1000) == 0 ? (value / 1000) : (value / 1000).toFixed(2)}` + "K" : (
            Number(value) != null ? `${value}` : '0'
        )
    }
    return (
        Number(value) != null ? `${value}` : '0'
    )
}

export function roundTwoDigit(number) {
    return Math.round(number * 10) / 10
}

// export class UtilsMethod {
//     static isObject(value) {
//         return value instanceof Object && !(value instanceof Array);
//     }

//     static isString(value) {
//         return typeof value === 'string' || value instanceof String;
//     }

//     static isBool(value) {
//         return typeof value === 'boolean' || value instanceof Boolean;
//     }

//     static isNumber(value) {
//         return !Number.isNaN(parseFloat(value)) && Number.isFinite(value);
//     }

//     static notEmptyString(value) {
//         return value && value.length !== 0;
//     }
// }
