/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const { writeFile } = require('fs');
const { promisify } = require('util');

const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

process.env.MOZ_HEADLESS = "1";
promise.USE_PROMISE_MANAGER = false;

const driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(new firefox.Options().setBinary(firefox.Channel.NIGHTLY))
.build();

async function main() {
  await driver.get('https://developer.mozilla.org/');
  await driver.findElement(By.id('home-q')).sendKeys('testing', Key.RETURN);
  await driver.wait(until.titleIs('Search Results for "testing" | MDN'));
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  });
  const data = await driver.takeScreenshot();
  await promisify(writeFile)('screenshot.png', data, 'base64');
  await driver.quit();
}

main();
