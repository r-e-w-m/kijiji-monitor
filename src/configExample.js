// Create a copy of this file named "config.js" and fill it with your personal settings.

const { locations, categories } = require("kijiji-scraper");

// Telegram Bot Configuration
const accessToken;
const chatID;

// Kijiji-Scraper Configuration
// Documentation for each parameter can be found in the ReadMe at https://github.com/mwpenny/kijiji-scraper
const params = {
    // Required Parameters
    // locationId:
    // categoryId:

    // Optional Parameters when using api or html scraperType
    //
    // minPrice:
    // maxPrice:
    // adType:

    // Optional Parameters when using api scraperType
    //
    // q:
    // sortType:
    // distance:
    // priceType:

    // Optional Parameters when using html scraperType
    //
    // keywords:
    // sortByName:
};

const options = {
    // pageDelayMs:
    // minResults:
    // maxResults:
    // scrapeResultsDetails:
    // resultDetailsDelayMs:
};

const searchInterval; // Search frequency in minutes


// Enable/Disable Debugging
const debugMode;
const debugType; // full, console, or external (log.txt)


// Exports
module.exports.telegramAccessToken = accessToken;
module.exports.telegramChatID = chatID;
module.exports.kijijiParams = params;
module.exports.kijijiOptions = options;
module.exports.searchInterval = searchInterval;
module.exports.debugMode = debugMode;
module.exports.debugType = debugType;
