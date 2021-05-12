const marked = require('marked');
const fs =require ('fs');
const {render_upgrade} = require('./CustomRenderer');
const logger = require('./Logger');

function getTitle(path) {
    const match = path.match(/(\.\.\/)(\w*)\//);
    return match[2];
}

function htmlGenerator(path){
    let title = getTitle(path);
    let text = fs.readFileSync(path, 'utf8');
    const HtmlBase = `<!DOCTYPE html>\n \n<html>\n \n   <head>\n     <title> ${title} Refcard</title>\n     <link rel='stylesheet' href='css/style.css'>\n   </head>\n<body>\n`;
    return HtmlBase +marked(text, {renderer:render_upgrade(metadataExtractor(path))}) + "\n </body>\n </html>";
}

function metadataExtractor(path) {
    let text = fs.readFileSync(path,'utf-8');
    const match = text.match(/(\[\/\/\]: #) \((\w*)\)/);
    return match[2];
}

function refcardCreator(path) {
    logger.info('Starting refcard generation');
    const pathStruct = {
        title : getTitle(path)
    }
    let text = htmlGenerator(path)
    fs.writeFile(`public/${pathStruct.title}.html`,text,function(err){
        if (err) throw err;
        logger.info(`Refcard ${pathStruct.title} generated!`);
    })
}


module.exports = {refcardCreator,metadataExtractor,htmlGenerator,getTitle};