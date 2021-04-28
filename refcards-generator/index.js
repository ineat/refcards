const winston = require("winston");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

logger.warn('Test warn log,');
logger.info('Test info log');
logger.error('Test error log');

module.exports = logger;