const marked = require('marked');
const {render_upgrade} = require("./script/CustomRenderer");
const winston = require("winston");
const fs =require ('fs');
const fse = require('fs-extra');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});


logger.info('Starting refcards generation');

const text = fs.readFileSync('../git/FR.md','utf8');

const HtmlBase = "<!DOCTYPE html>\n" +
    " \n" +
    "<html>\n" +
    " \n" +
    "   <head>\n" +
    "     <title>Git Refcard</title>\n" +
    "   </head>\n" +
    "<body>\n";

const html = HtmlBase +marked(text, {
    renderer:render_upgrade("red")
}) + "\n </body>\n </html>";

fs.mkdir('public/git', (err) => {
    logger.info("Refcard Git créée!");
});

fs.mkdir('public/git/assets', (err) => {
    logger.info("Refcard Git créée!");
});

try {
    fse.copySync('../git/assets', 'public/git/assets', {overwrite: true});
} catch (err) {
    if (err) throw err;
}

fs.writeFile('public/git.html',html, (err) => {
    if (err) throw err;
    logger.info("Refcard Git créée!");
});


module.exports = logger;