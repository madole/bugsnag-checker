# 🐛 A quick bugsnag stability score checker 🐞

## Usage

-   `npm install` to install dependencies
-   create a `.env` file
-   Add the following properties
    -   USERNAME -> your bugsnag username
    -   PASSWORD -> your bugsnag password
    -   URL -> url to your project's releases page

Set up a cron job to call `bugsnag.js` every day to get notified of your stability score

Example

`30 10 * * 1-5 /usr/local/bin/node /Users/******/bugsnag-checker/bugsnag.js`
