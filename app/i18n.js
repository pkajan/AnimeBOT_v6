const i18n = require('i18n');
const { language } = require('../config/config.json');

// minimal config i18n
i18n.configure({
    directory: __dirname + '/../locales',
    defaultLocale: language,
});
global.i18n = i18n;
