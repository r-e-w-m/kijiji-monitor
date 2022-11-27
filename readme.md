# Kijiji Watcher

## Description

Humble tool to scrape Kijiji for new ads and relay them to Telegram (via a telegram bot) and the command line. Supports setting up multiple searches to run concurrently and defining search frequency. 

## Documentation Notes:

Requires a working Node.js installation.

Getting started:

    1. Create a folder in the root project directory named "logs".

    2. Open the root project directory in a terminal and run "npm install" to install dependencies.

    3. Create a copy of "configExample" in the "src" directory and name it "config.json".

    4. I have evidently not written any documentation on the information required to configure the "params" and "telegram" sections of this config file. You can dig this information out of the requests sent to Kijiji when you perform a manual search on the website, if you are technically inclined. Otherwise rename the "configWorkingExample" file to config.json to see the application run a pre-configured search. I will need to gather a complete list of valid responses and add them to either a wiki or a configuration script in the future.

    5. Open the root project directory in a terminal again and run "node src/index.js".

    6. The first search will run in 2x the shortest search interval you have specified, and then on the interval after that.
