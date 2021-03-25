// Imports
const { Ad, search } = require("kijiji-scraper");
const { TelegramClient } = require("messaging-api-telegram");
const config = require("./config.js");
const { ToadScheduler, SimpleIntervalJob, Task} = require("toad-scheduler");
const engineer = require("./engineer"); // Engineer solves problems


// Variables
var validAds = [];
var lastSearchTime = new Date(); // '2021-02-17T03:24:00'
const debugMode = config.debugMode;
const searchInterval = config.searchInterval;
const client = new TelegramClient({
    accessToken: config.telegramAccessToken
});


// Main
const main = x => {

    const scheduler = new ToadScheduler();
    const task = new Task("Scrape New Ads", () => {
        search(config.kijijiParams, config.kijijiOptions).then(ads => {
            printSearchInfo();
            if (debugMode) { engineer.logSearchInfo(config.kijijiParams.q, ads); };
            validateAds(ads);
            if (debugMode) { engineer.logSearchResults(validAds); };
            printAdInfo(validAds);
            notifyTelegram(validAds);

            // Prep for next search
            validAds = [];
            lastSearchTime = new Date();
        });
    });
    const job = new SimpleIntervalJob({ minutes: searchInterval, }, task);
    new SimpleIntervalJob()
    console.log("Starting up...\nNext check in " + searchInterval + " minute(s).");
    scheduler.addSimpleIntervalJob(job);
};

main();

// Function Definitions

// Seperate out ads we don't care about
function validateAds(ads) {
    for (let i = 0; i < ads.length; i++) {
        let notSponsored = isNotSponsored(ads[i]);
        let postedAfterLastSearch = validateAdPostTime(ads[i]);
        if (debugMode) { engineer.logAdValidation(ads[i], notSponsored, postedAfterLastSearch); };
        if (postedAfterLastSearch && isNotSponsored) {
            validAds.push(ads[i]);
        } else if (!postedAfterLastSearch && isNotSponsored) {
            i = ads.length;
        }
    }
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
    if (newAds.length > 0) {
        client.sendMessage(config.telegramChatID, newAds.length + " new ads found.");
    };
    // Ads are in reverse order, so read them backwards
    for (i = newAds.length-1; i >= 0; i--) {
        client.sendMessage(config.telegramChatID, newAds[i].toString());
    };
};

// Print ad info from array to console
function printAdInfo(ads) {
    console.log("Found " + ads.length + " Ads:\n================");
    for (let i = 0; i < ads.length; i++) {
        console.log(ads[i].title + " || Posted at: " + ads[i].date);
    };
    console.log("================\nNext check in " + searchInterval + " minute(s).\n")
};

// Print information about the current search to console
function printSearchInfo() {
    console.log("\nLast search was at: " + lastSearchTime);
    console.log("Searching for ads containing \"" + config.kijijiParams.q + "\"");
}