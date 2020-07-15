const { chromium, selectors } = require("playwright");
const notifier = require("node-notifier");
const path = require("path");
require("dotenv").config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const URL = process.env.URL;

const createTagNameEngine = () => ({
    // Selectors will be prefixed with "tag=".
    name: "tag",

    // Creates a selector that matches given target when queried at the root.
    // Can return undefined if unable to create one.
    create(root, target) {
        return root.querySelector(target.tagName) === target
            ? target.tagName
            : undefined;
    },

    // Returns the first element matching given selector in the root's subtree.
    query(root, selector) {
        return root.querySelector(selector);
    },

    // Returns all elements matching given selector in the root's subtree.
    queryAll(root, selector) {
        return Array.from(root.querySelectorAll(selector));
    },
});

(async () => {
    await selectors.register(createTagNameEngine);

    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: {
            width: 1440,
            height: 800,
        },
    });
    const page = await context.newPage();
    await page.goto(URL);
    await page.focus("#user_email");
    await page.keyboard.type(USERNAME);
    await page.focus("#user_password");
    await page.keyboard.type(PASSWORD);
    await page.click('tag=button >> text="Sign in"');
    await page.waitForNavigation();
    const stabiltyScore = await page.$eval(".StabilityScore-score", (div) =>
        parseFloat(div.innerText),
    );

    const emoji = stabiltyScore < 98.5 ? "🚨" : "💚";
    const icon = stabiltyScore < 98.5 ? "./bug.png" : "./slug.png";

    notifier.notify({
        title: "BUGSNAG: Stablity Score",
        message: `${emoji} ${stabiltyScore}%`,
        icon: path.join(__dirname, icon),
    });
    await browser.close();
})();
