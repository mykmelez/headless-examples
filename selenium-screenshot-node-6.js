/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const { writeFile } = require('fs');

const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const binary = new firefox.Binary(firefox.Channel.NIGHTLY);
binary.addArguments("--headless");

const driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(new firefox.Options().setBinary(binary))
.build();

driver.get('https://developer.mozilla.org/');
driver.findElement(By.id('home-q')).sendKeys('testing', Key.RETURN);
driver.wait(until.titleIs('Search Results for "testing" | MDN'));
driver.wait(() => {
  return driver.executeScript('return document.readyState').then(readyState => {
    return readyState === 'complete';
  });
});
driver.takeScreenshot()
.then(data => {
  writeFile('screenshot.png', data, 'base64', () => driver.quit());
})
.catch(console.error);
