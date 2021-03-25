const { locations, categories } = require("kijiji-scraper");

// Telegram Bot Configuration
const accessToken = '1770915302:AAG8ETIXYS03JNxhO-R8y36M6mJY2R2Bc5g';
const chatID = -564697061;


// Kijiji-Scraper Configuration
const params = {
    locationId: locations.NOVA_SCOTIA.HALIFAX.CITY_OF_HALIFAX,
    categoryId: categories.BUY_AND_SELL,
    q: "new",
    sortType: "DATE_DESCENDING",
    distance: 50
};

const options = {
    minResults: 1,
    maxResults: 10
};

const searchInterval = 0.5; // Search frequency in minutes


// Enable/Disable Debugging
const debugMode = true;
const debugType = "external"; // full, console, or external (log.txt)


// Exports
module.exports.telegramAccessToken = accessToken;
module.exports.telegramChatID = chatID;
module.exports.kijijiParams = params;
module.exports.kijijiOptions = options;
module.exports.searchInterval = searchInterval;
module.exports.debugMode = debugMode;
module.exports.debugType = debugType;