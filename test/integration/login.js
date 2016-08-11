'use strict'
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    fs = require('fs');
var _ = require('underscore');
var VARS = {};

const USERNAME='administrator';
const LOGIN=USERNAME + "@datagraft.net";

var globalTimeout = 90*1000;

var driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

driver.controlFlow().on('uncaughtException', function(err) {
    console.log('There was an uncaught exception: ' + err);
});

describe("Login", function() {

    before(function() {
        return driver.manage().window().setSize(1280, 800);
    });

    it("should log in", function() {
        return driver.get("http://localhost:55555/").then(function() {
            return driver.findElement(By.linkText("Login")).click();
        }).then(function() {
            return driver.wait(function() {
                return driver.findElement(By.id("new_user")).isDisplayed();
            });
        }).then(function() {
            return driver.findElement(By.id("user_email")).click();
        }).then(function() {
            return driver.findElement(By.xpath("//form[@id='new_user']/div[1]/div")).click();
        }).then(function() {
            return driver.findElement(By.id("user_email")).clear();
        }).then(function() {
            return driver.findElement(By.id("user_email")).sendKeys(LOGIN);
        }).then(function() {
            return driver.findElement(By.id("user_password")).clear();
        }).then(function() {
            return driver.findElement(By.id("user_password")).sendKeys("password");
        }).then(function() {
            return driver.findElement(By.name("commit")).click();
        }).then(function() {
            return driver.wait(function(){
                return driver.findElement(By.css("nav.mdl-navigation > *:last-child")).getText().then(function (text) {
                    return (_.isEqual(text, USERNAME));
                });
            }, globalTimeout);
        });
    });

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            var that = this;
            return driver.takeScreenshot().then(function (data) {
                var testName = that.currentTest.title;
                var fileName = "failure_" + testName.replace(/[^a-z0-9]/gi, '_')
                                    .toLowerCase() + ".png";
                fs.writeFileSync(fileName, data, 'base64');
                console.log("Test '" + testName + "' failed. " +
                            "Screenshot saved to " + fileName);
            });
        }
    });

    after(function() {
        driver.quit();
    });
});


