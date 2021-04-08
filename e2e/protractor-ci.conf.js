const config = require('./protractor.conf').config;

exports.config = {
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
        args: ['--headless', '--no-sandbox', '--disable-gpu'],
        binary: require('puppeteer').executablePath(),
        },
    },
    ...config,
};
