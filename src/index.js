// Imports
const { Ad, search } = require("kijiji-scraper");
const { TelegramClient } = require("messaging-api-telegram");
const { ToadScheduler, SimpleIntervalJob, Task} = require("toad-scheduler");
const config = require("./config.js");
const engineer = require("./engineer"); // Engineer solves problems

// Settings
const debugMode = config.debugMode;
const searchInterval = config.searchInterval;

// Variables
var previousAds = [];
var lastSearchTime = new Date(); // '2021-02-17T03:24:00'
const scheduler = new ToadScheduler();
const task = new Task("Scrape New Ads", () => main());
const job = new SimpleIntervalJob({ minutes: searchInterval }, task);
const client = new TelegramClient({ accessToken: config.telegramAccessToken });

engineer.loggers("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
engineer.loggers("Starting up the scraper...");
engineer.loggers("The first scan will occur in " + searchInterval + " minute(s).");
engineer.loggers("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
scheduler.addSimpleIntervalJob(job);


// Main
async function main() {
    const currentTime = new Date(); // Record the start time for this search.
    const searchResults = await search(config.kijijiParams, config.kijijiOptions);
    if (debugMode) { engineer.logSearchInfo(config.kijijiParams.q, searchResults, lastSearchTime, currentTime); };
    
    const validAds = validateAds(searchResults);
    if (debugMode) { engineer.logSearchResults(searchResults, validAds); };

    notifyTelegram(validAds);

    // Prep for next search
    previousAds = searchResults;
    lastSearchTime = currentTime;
    
};

// Seperate out ads we don't care about
function validateAds(ads) {
    var validAds = [];
    for (let i = 0; i < ads.length; i++) {
        let notSponsored = isNotSponsored(ads[i]);
        let newAd = notInLastSearch(ads[i]);
        if (debugMode) { engineer.logAdValidation(ads[i], notSponsored, newAd, lastSearchTime); };
        if (newAd && isNotSponsored) {
            validAds.push(ads[i]);
        }
    }
    return validAds;
}

// Check if each ad was found in the previous search.
function notInLastSearch(ad) {
    for (var i = 0; i < previousAds.length; i++) {
        if (previousAds[i].url.localeCompare(ad.url) == 0) {
            return false;
        };
    } return true;
}

// Determine if the ad was posted after the last search
function validateAdPostTime(ad) {
    if (ad.date > lastSearchTime) {
        return true;
    }
    return false;
}

// Remove sponsored ads
// Sponsored ads do not contain a time they were posted
// This can be used to filter them out
function isNotSponsored(ad) {
    if (!isNaN(ad.date)) {
        return true;
    };
    return false;
};

// Send information about new ads to Telegram
function notifyTelegram(newAds) {
    var output = "";
    if (newAds.length > 0) {
        output = output.concat(newAds.length + " new ad(s) found.\n\n");

        // Ads are in reverse order, so read them backwards
        for (i = newAds.length-1; i >= 0; i--) {
            output = output.concat(newAds[i].toString() + "\n");
        };

        client.sendMessage(config.telegramChatID, output);
    };
};
