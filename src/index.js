// Imports
const { Ad, search } = require("kijiji-scraper");
const { TelegramClient } = require("messaging-api-telegram");
const { ToadScheduler, SimpleIntervalJob, Task} = require("toad-scheduler");
const config = require("./config.json");
const engineer = require("./engineer.js"); // Engineer solves problems

// Settings
const debugMode = config.internalSettings.debugMode;
// const searchInterval = config.kijijiScraper.searchIntervalMinutes;

// Variables
var i = 0;
var previousAds = [];       // 2d array of ads, one array per search
var lastSearchTime = [];    // array of dates, one per search || '2021-02-17T03:24:00'
var firstSearch = [];
const scheduler = new ToadScheduler();
const client = new TelegramClient({ accessToken: config.Telegram.accessToken });

engineer.loggers("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
engineer.loggers("Starting up the scraper...");
engineer.loggers("The first scan will occur 2x your shortest scan interval.");
engineer.loggers("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");


config.kijijiScraper.forEach(kijijiConfig => {
    const currentJobNumber = i;
    const task = new Task("Scrape New Ads " + currentJobNumber, () => main(kijijiConfig, currentJobNumber));
    const job = new SimpleIntervalJob({ minutes: kijijiConfig.searchIntervalMinutes }, task);

    previousAds.push([]);
    firstSearch.push(true);
    lastSearchTime.push(new Date());

    scheduler.addSimpleIntervalJob(job)
    i = i + 1;
});


// Main
async function main(kijijiConfig, jobNumber) {
    var isFirstSearch = firstSearch[jobNumber];
    var validAds;
    const currentTime = new Date(); // Record the start time for this search.
    const searchResults = await search(kijijiConfig.params, kijijiConfig.options);
    if (debugMode, !isFirstSearch) { engineer.logSearchInfo(kijijiConfig.params.q, searchResults, lastSearchTime[jobNumber], currentTime, jobNumber); };
    if (!isFirstSearch) {validAds = validateAds(searchResults, jobNumber)};
    if (debugMode, !isFirstSearch) { engineer.logSearchResults(searchResults, validAds, jobNumber); };
    if (!isFirstSearch) notifyTelegram(validAds);

    // Prep for next search
    previousAds[jobNumber] = searchResults;
    lastSearchTime[jobNumber] = currentTime;
    if (isFirstSearch) {firstSearch[jobNumber] = false;};
};

// Seperate out ads we don't care about
function validateAds(ads, jobNumber) {
    var validAds = [];
    for (let i = 0; i < ads.length; i++) {
        let notSponsored = isNotSponsored(ads[i]);
        let newAd = notInLastSearch(ads[i], jobNumber);
        if (debugMode) { engineer.logAdValidation(ads[i], notSponsored, newAd); };
        if (newAd && isNotSponsored) {
            validAds.push(ads[i]);
        }
    }
    return validAds;
}

// Check if each ad was found in the previous search.
function notInLastSearch(ad, jobNumber) {
    for (var i = 0; i < previousAds[jobNumber].length; i++) {
        if (previousAds[jobNumber][i].url.localeCompare(ad.url) == 0) {
            return false;
        };
    } return true;
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

        client.sendMessage(config.Telegram.chatID, output);
    };
};
