/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const utils = require("./utils.js");
const { By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

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

  it("successfully opens the study template options page on installation", async function () {
    await this.driver.get("https://wikipedia.org");

   // Let's wait until the page is fully loaded and the title matches. 
    await this.driver.wait(
      until.titleIs("Wikipedia"),
      WAIT_FOR_PROPERTY
    );
  });
});
