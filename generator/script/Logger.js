const winston = require("winston");

/**
 * Create a logger for the project
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});


module.exports = logger;