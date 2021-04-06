// Imports
const { Ad, search } = require("kijiji-scraper");
const { TelegramClient } = require("messaging-api-telegram");
const { ToadScheduler, SimpleIntervalJob, Task} = require("toad-scheduler");
const config = require("./config.js");
const engineer = require("./engineer"); // Engineer solves problems

const client = new TelegramClient({
    accessToken: config.telegramAccessToken
});

const exampleAd = new Ad(
    'https://www.kijiji.ca/v-home-outdoor-other/city-of-halifax/brand-new-55-gallon-drums/1557885201',
    {title: 'iPhone 6s ',
    description: 'iPhone 6s - in great condition always stored in a case since new. Memory- 16gb Battery life okay',
    date: "2021-03-27T21:58:55.000Z",
    image: 'https://i.ebayimg.com/00/s/ODAwWDYwMA==/z/yysAAOSwywxgX6qW/$_57.JPG',       
    images: [
      'https://i.ebayimg.com/00/s/ODAwWDYwMA==/z/yysAAOSwywxgX6qW/$_57.JPG',
      'https://i.ebayimg.com/00/s/ODAwWDYwMA==/z/oBcAAOSwXJ5gX6qX/$_57.JPG',
      'https://i.ebayimg.com/00/s/NjAwWDgwMA==/z/WksAAOSw3h9gX6qZ/$_57.JPG',
      'https://i.ebayimg.com/00/s/NjAwWDgwMA==/z/6ssAAOSwbwVgX6qe/$_57.JPG'
    ],
    attributes: {
      phonebrand: 'apple',
      phonecarrier: 'unlck',
      forsaleby: 'ownr',
      price: 100,
      location: 'Lindy Ln, Dartmouth, NS B2X 3V8, Canada',
      type: 'OFFERED'
    },
    url: 'https://www.kijiji.ca/v-cell-phone/dartmouth/iphone-6s/1557878013'},
    true
);

const exampleAd2 = new Ad(
    "https://www.kijiji.ca/v-other-business-industrial/dartmouth/business-tote-and-laptop-case/1557885945",
    {title: 'bell fibe tv remotes brand new one is bluetooth brand new',
    description: 'bell fibe tv remotes brand new one is bluetooth brand new $25 other non bluetooth opened but not ...',
    date: "2021-03-27T22:11:13.000Z",
    image: '',
    images: [],
    attributes: {
        forsaleby: 'ownr',
        price: 25,
        location: 'Halifax, NS B3K',
        type: 'OFFERED'
    }},
    true
);

var ads = [exampleAd, exampleAd2];

// Send information about new ads to Telegram
function notifyTelegram(newAds) {
    var output = "";
    if (newAds.length > 0) {

        output = output.concat(newAds.length + " new ad(s) found.\n\n");
        // client.sendMessage(config.telegramChatID, newAds.length + " new ads found.");

        // Ads are in reverse order, so read them backwards
        for (i = newAds.length-1; i >= 0; i--) {
            output = output.concat(newAds[i].toString() + "\n");
            // client.sendMessage(config.telegramChatID, newAds[i].toString());
        };

        client.sendMessage(config.telegramChatID, output);
    };
};

notifyTelegram(ads);
