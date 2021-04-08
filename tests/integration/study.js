/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const assert = require("assert");
const utils = require("./utils.js");
const { By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const fs = require('fs');
const readline = require('readline');
const { exception } = require("console");

// The number of milliseconds to wait for some
// property to change in tests. This should be
// a long time to account for slow CI.
const WAIT_FOR_PROPERTY = 5000;

/**
* Find the element and perform an action on it.
*
* @param driver
*        The Selenium driver to use.
* @param element
*        The element to look for and execute actions on.
* @param action
*        A function in the form `e => {}` that will be called
*        and receive the element once ready.
*/
async function findAndAct(driver, element, action) {
  await driver.wait(until.elementLocated(element), WAIT_FOR_PROPERTY);
  await driver.findElement(element).then(e => action(e));
}

async function processLineByLine(pattern, expectedCount) {
  const fileStream = fs.createReadStream("integration.log");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    if (line.includes(pattern)) {
      count++;
    }
  }

  assert.ok(count == expectedCount, `Expected pattern ${pattern} to be present on ${expectedCount} line*s) of browser console output`);
}


describe("Study Template integration test example", function () {
  // eslint-disable-next-line mocha/no-hooks-for-single-case
  beforeEach(async function () {
    this.driver = await utils.getFirefoxDriver(true);
    await this.driver.installAddon("web-ext-artifacts/study.xpi");
    await this.driver.setContext(firefox.Context.CONTENT);
  });

  // eslint-disable-next-line mocha/no-hooks-for-single-case
  afterEach(async function () {
    await this.driver.quit();
  });

  it("successfully runs the study against test sites", async function () {
    await this.driver.get(`file:///${__dirname}/sites/wikipedia/index.html`);

    // Let"s wait until the page is fully loaded and the title matches.
    await this.driver.wait(
      until.titleIs("Wikipedia"),
      WAIT_FOR_PROPERTY
    );

    expectedCount = 1;
    await processLineByLine("RS01", expectedCount);
  });
});
