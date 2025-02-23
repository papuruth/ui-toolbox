import { each, forEach, isEmpty, keys, reduce } from "lodash";

export const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
};

export const applyShadowToQRImage = async (qrcodeImage, logo) => {
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imgQRCode = new Image();
        imgQRCode.src = qrcodeImage;
        imgQRCode.crossOrigin = "anonymous";

        const ratioMultiplier = 2;
        const margin = 10 * ratioMultiplier;
        const qrPadding = 10 * ratioMultiplier;
        const shadowBlur = 10 * ratioMultiplier;
        const shadowColor = "#00000033";
        const fillStyle = "#FFFFFFFF";
        const radius = 5 * ratioMultiplier;

        await imgQRCode.decode();
        const canvasWidth = imgQRCode.width + margin * 2 + qrPadding + shadowBlur;
        const canvasHeight = imgQRCode.height + margin * 2 + qrPadding + shadowBlur;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = fillStyle;

        ctx.roundRect(margin, margin, imgQRCode.width + margin * 2, imgQRCode.height + margin * 2, radius);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.drawImage(imgQRCode, margin + qrPadding, margin + qrPadding, imgQRCode.width, imgQRCode.height);
        if (logo) {
            const logoImg = new Image();
            logoImg.src = logo;
            logoImg.crossOrigin = "anonymous";
            await logoImg.decode();
            const canvasCentreHorizontal = canvas.height / 2;
            const canvasCentreVertical = canvas.height / 2;
            const logoHeight = canvasCentreHorizontal * 0.4;
            const logoWidth = canvasCentreVertical * 0.4;
            const imageStartHorizontal = canvasCentreHorizontal - logoWidth / 2;
            const imageStartVertical = canvasCentreVertical - logoHeight / 2;
            ctx.drawImage(logoImg, imageStartHorizontal, imageStartVertical, logoWidth, logoHeight);
            return canvas.toDataURL();
        }
        return canvas.toDataURL();
    } catch (error) {
        console.log("error", error.message);
        return qrcodeImage;
    }
};

export const createActionTypes = (prefix = "", actionTypeList = []) => {
    const actionTypesObject = {};

    each(actionTypeList, (item) => {
        actionTypesObject[item] = `${prefix}/${item}`;
    });

    return actionTypesObject;
};

export const getImageAspectRatio = (width, height) => {
    let gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(width, height);

    return [width / gcd, height / gcd];
};

export const getDataUrl = async (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.onabort = reject;
        reader.readAsDataURL(file);
    });

export const addParamsToURL = (url, params) => {
    if (isEmpty(params)) {
        return url;
    }
    let tempUrl = url.trim();
    if (tempUrl.endsWith("/")) {
        tempUrl = tempUrl.slice(0, -1);
        tempUrl += "?";
    } else {
        tempUrl += "?";
    }
    forEach(keys(params), (k, index) => {
        if (index < keys(params).length - 1) {
            tempUrl += `${k}=${params[k]}&`;
        } else {
            tempUrl += `${k}=${params[k]}`;
        }
    });
    return tempUrl;
};

export const queriesToParamsObject = (query) => {
    const queryString = query.substring(1);
    const splittedString = queryString.split("&");
    return reduce(
        splittedString,
        (acc, item) => {
            const [key, value] = item.split("=");
            acc[key] = value;
            return acc;
        },
        {}
    );
};

// Password Generator
function getCharAt(charArray, index) {
    return charArray[index % charArray.length];
}

function scrambleArray(chars) {
    return chars.sort(() => Math.random() - 0.5);
}

function getAllowedChars(compositionRule, AllowedUpperArray, AllowedLowerArray, AllowedNumberArray, AllowedSymbolArray) {
    let chars = [];
    if (!compositionRule.upperCase?.forbidden) chars = chars.concat(AllowedUpperArray);
    if (!compositionRule.lowerCase?.forbidden) chars = chars.concat(AllowedLowerArray);
    if (!compositionRule.numbers?.forbidden) chars = chars.concat(AllowedNumberArray);
    if (!compositionRule.symbols?.forbidden) chars = chars.concat(AllowedSymbolArray);
    return chars;
}

/**
 * @summary Password generator using window.crypto
 * @description The [assword generator will generate random password using the specified allowed list. The list contains whether to include uppercase, lowercase, numbers and symbols
 * @param {number} length - password's length
 * @param {object} compositionRule - Containe flag and min of uppercase, lowercase, numbers and symbols in generated password
 * @param {object} allowedList - Contains each rules allowed characters, numbers and symbols
 * @returns a generated password
 */
export const passwordGenerator = (length = 8, compositionRule = {}, allowedList = {}) => {
    const AllowedUpperArray = Array.from(allowedList.Uppers);
    const AllowedLowerArray = Array.from(allowedList.Lowers);
    const AllowedNumberArray = Array.from(allowedList.Numbers);
    const AllowedSymbolArray = Array.from(allowedList.Symbols);

    const { upperCase, lowerCase, numbers, symbols } = compositionRule;
    const indexes = crypto.getRandomValues(new Uint32Array(length));

    const chars = [];
    let i = 0;
    let lastIndex = i;
    // eslint-disable-next-line no-plusplus
    while ((i < upperCase?.min || 0) && !upperCase.forbidden) chars.push(getCharAt(AllowedUpperArray, indexes[i++]));
    // eslint-disable-next-line no-plusplus
    while (i < lastIndex + (lowerCase?.min || 0) && !lowerCase.forbidden) chars.push(getCharAt(AllowedLowerArray, indexes[i++]));
    lastIndex = i;
    // eslint-disable-next-line no-plusplus
    while (i < lastIndex + (numbers?.min || 0) && !numbers.forbidden) chars.push(getCharAt(AllowedNumberArray, indexes[i++]));
    lastIndex = i;
    // eslint-disable-next-line no-plusplus
    while (i < lastIndex + (symbols?.min || 0) && !symbols.forbidden) chars.push(getCharAt(AllowedSymbolArray, indexes[i++]));

    const allowedChars = getAllowedChars(compositionRule, AllowedUpperArray, AllowedLowerArray, AllowedNumberArray, AllowedSymbolArray);
    // eslint-disable-next-line no-plusplus
    while (i < length || 0) chars.push(getCharAt(allowedChars, indexes[i++]));
    return scrambleArray(chars).join("");
};

export function formatNumberToUnits(val) {
    // Thousands, millions, billions, trillions, quadrillions, etc..
    const units = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    // Dividing the value by 3.
    const sNum = Math.floor(`${val}`.length / 3);
    // Calculating the precised value.
    let sVal = parseFloat((sNum !== 0 ? val / 1000 ** sNum : val).toPrecision(2));

    if (sVal % 1 !== 0) {
        sVal = sVal.toFixed(1);
    }
    // Appending the letter to precised val.
    return sVal + units[sNum];
}

export const getRandomNumbers = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
