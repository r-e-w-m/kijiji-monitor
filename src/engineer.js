// Imports
const fs = require("fs");
const stream = fs.createWriteStream("./logs/DebugLog-" + new Date().toLocaleDateString() + ".txt", {flags:'a'});
const config = require("./config.js");
const { Ad } = require("kijiji-scraper");


// Header
function logSearchInfo(searchTerm, ads) {
    loggers("New search started for: \"" + searchTerm + "\"");
    loggers("Examining " + ads.length + " ads!");
}


// Body
function logAdValidation(ad, isNotSponsored, postedAfterLastSearch, ads, lastSearchTime) {
    if (isNotSponsored) { 
        loggers("Ad with title: \"" + ad.title + "\" is not sponsored!"); 
    } else { 
        loggers("Ad with title: \"" + ad.title + "\" is sponsored!");
    };

    if (postedAfterLastSearch) { 
        loggers("Ad with title: \"" + ad.title + "\" is new!"); 
    } else { 
        loggers("Ad with title: \"" + ad.title + "\" is old!"); 
    };

    if (isNotSponsored && postedAfterLastSearch) { 
        loggers("Ad with title: \"" + ad.title + "\" validated!"); 
    } else if (!isNotSponsored) { 
        loggers("Ad with title \"" + ad.title + "\" is sponsored, moving to next ad!"); 
    } else { 
        loggers("Ad with title: \"" + ad.title + "\" after cutoff date, stopping search!"); 
        loggers("Last Search was at: " + lastSearchTime.toLocaleTimeString() + " and ad was posted at " + ad.date.toLocaleTimeString());
        loggers("List of ads returned from scraper:");
        for (var i = 0; i < ads.length; i++) {
            loggers("||| " + ads[i].title + " - " + ads[i].date.toLocaleDateString() + " " + ads[i].date.toLocaleTimeString());
        }
    };
}


// Footer
function logSearchResults(validAds) {
    loggers(validAds.length + " ads found to be valid.");
    if (config.debugType == "full" || config.debugType == "external") { stream.write("\n"); };
}


// Logging logic
function loggers(output) {
    switch(config.debugType) {
        case "full":
            console.log("DEBUG - " + output);
            stream.write(new Date().toLocaleTimeString() + " - " + output + "\n");
            break;

        case "console":
            console.log("DEBUG - " + output);
            break;

        case "external":
            stream.write(new Date().toLocaleTimeString() + " - " + output + "\n");
            break;
            
        default:
            console.log("DEBUG - " + output);
            stream.write(new Date().toLocaleTimeString() + " - " + output + "\n");
            break;
    }
}


module.exports.logSearchInfo = logSearchInfo;
module.exports.logAdValidation = logAdValidation;
module.exports.logSearchResults = logSearchResults;
