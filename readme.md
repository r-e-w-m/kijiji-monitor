# Kijiji Watcher

Makes use of various libraries scrape Kijiji and notify users of new postings as frequently as they would like on Telegram and in the terminal.

## ToDo:

- [x] Check that each scan is actually recieving ads from kijiji to ensure I'm not being blocked

- [x] Start logging important information to a file. This could include the number of ads removed for one.

- [ ] Allow multiple searches to be defined.

- [ ] Display a live countdown to the next scan in terminal.

## Nice-to-Haves

- [ ] Alerts on additional platforms.

- [ ] Define new searches remotely e.g. via Telegram bot.

## Known Bugs:

- [ ] Certain ads are not being picked up as new when they are posted. In a test, an ad posted at 6:39:15pm was not in the list of results returned by a scan performed at 6:39:40pm~, despite having been live for 25 seconds at that point. The next scan 30 seconds later found this ad, but because it was found to be posted before the scan done at 6:39:40pm it was classified as having already been pushed to users. 
