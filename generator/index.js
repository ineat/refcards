const marked = require('marked');
const {render_upgrade} = require("./generator/markedCustomRenderer");
const winston = require("winston");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

logger.info('Starting refcards generation');


md = '> la commande `git show` permet de ....';

logger.info(marked(md, {
    renderer: render_upgrade()
}))



module.exports = logger;