// Imports
const fs = require("fs");
const stream = fs.createWriteStream("./logs/DebugLog-" + new Date().toLocaleDateString() + ".txt", {flags:'a'});
const config = require("./config.json");


// Header
function logSearchInfo(searchTerm, ads, lastSearchTime, currentSearchTime, jobNumber) {
    loggers("New search started for: \"" + searchTerm + "\"");
    loggers("Retrieving the " + config.kijijiScraper[jobNumber].options.maxResults + " newest ad(s).");
    loggers("Last Search: " + lastSearchTime.toLocaleTimeString() 
    + ", Current Search: " + currentSearchTime.toLocaleTimeString());
}


// Body
function logAdValidation(ad, isNotSponsored, newAd) {
    var output = "Post Time: " + ad.date.toLocaleTimeString() + " == Sponsored: [";

    if (!isNotSponsored) { output = output.concat("X") } else { output = output.concat(" ") };
    output = output.concat("] == New: [");
    
    if (newAd) { output = output.concat("X")} else { output = output.concat(" ")};
    output = output.concat("] == Title: " + ad.title);

    loggers(output);
}


// Footer
function logSearchResults(ads, validAds, jobNumber) {
    loggers(validAds.length + " ad(s) found to be valid.");
    if (config.internalSettings.debugType == "full" || config.internalSettings.debugType == "external") { stream.write("\n"); };
    loggers("Next scan will occur in " + config.kijijiScraper[jobNumber].searchIntervalMinutes + " minutes(s).\n")
}


// Logging logic
function loggers(output) {
    const timeStamp = new Date().toLocaleTimeString() + " - ";
    switch(config.internalSettings.debugType) {
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
