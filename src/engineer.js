// Imports
const fs = require("fs");
const stream = fs.createWriteStream("./logs/DebugLog-" + new Date().toLocaleDateString() + ".txt", {flags:'a'});
const config = require("./config.js");
const { Ad } = require("kijiji-scraper");


// Header
function logSearchInfo(searchTerm, ads, lastSearchTime, currentSearchTime) {
    loggers("New search started for: \"" + searchTerm + "\"");
    loggers("Retrieving the " + config.kijijiOptions.maxResults + " newest ads.");
    loggers("Last Search: " + lastSearchTime.toLocaleTimeString() 
    + ", Current Search: " + currentSearchTime.toLocaleTimeString());
}


// Body
function logAdValidation(ad, isNotSponsored, newAd, lastSearchTime) {
    var output = "Post Time: " + ad.date.toLocaleTimeString() + " == Sponsored: [";

    if (!isNotSponsored) { output = output.concat("X") } else { output = output.concat(" ") };
    output = output.concat("] == New: [");
    
    if (newAd) { output = output.concat("X")} else { output = output.concat(" ")};
    output = output.concat("] == Title: " + ad.title);

    loggers(output);
}


// Footer
function logSearchResults(ads, validAds) {
    loggers(validAds.length + " ads found to be valid.");
    if (config.debugType == "full" || config.debugType == "external") { stream.write("\n"); };
    loggers("Next scan will occur in " + config.searchInterval+ " minutes(s).\n")
}


// Logging logic
function loggers(output) {
    const timeStamp = new Date().toLocaleTimeString() + " - ";
    switch(config.debugType) {
        case "full":
            console.log(timeStamp + output);
            stream.write(timeStamp + output + "\n");
            break;

        case "console":
            console.log(timeStamp + output);
            break;

        case "external":
            stream.write(timeStamp + output + "\n");
            break;
            
        default:
            console.log(timeStamp + output);
            stream.write(timeStamp + output + "\n");
            break;
    }
}


module.exports.logSearchInfo = logSearchInfo;
module.exports.logAdValidation = logAdValidation;
module.exports.logSearchResults = logSearchResults;
module.exports.loggers = loggers;
