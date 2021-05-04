const marked = require('marked');
const {render_upgrade} = require("./script/CustomRenderer");
const winston = require("winston");
const fs =require ('fs');

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
    renderer:render_upgrade()
}) + "\n </body>\n </html>";



fs.writeFile('public/git.html',html, function(err){
    if (err) throw err;
    logger.info("Refcard Git créée!");
});


module.exports = logger;