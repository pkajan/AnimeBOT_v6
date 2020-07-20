const { logfile } = require('../config/config.json');
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: `${logfile}`,
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);


module.exports.debug = function (data) {
    log.debug(`${data}`);
};

module.exports.info = function (data) {
    log.info(`${data}`);
};

module.exports.warn = function (data) {
    log.warn(`${data}`);
};

module.exports.error = function (data) {
    log.error(`${data}`);
};

module.exports.fatal = function (data) {
    log.fatal(`${data}`);
};
