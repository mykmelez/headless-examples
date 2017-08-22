let fs = require('fs');
let webdriver = require('selenium-webdriver');
let firefox = require('selenium-webdriver/firefox');

let Builder = webdriver.Builder;
let By = webdriver.By;
let Key = webdriver.Key;
let until = webdriver.until;

process.env.MOZ_HEADLESS = "1";

let driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(new firefox.Options().setBinary(firefox.Channel.NIGHTLY))
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
  fs.writeFile('screenshot.png', data, 'base64', () => driver.quit());
})
.catch(console.error);
