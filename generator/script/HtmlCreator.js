const marked = require('marked');
const fs =require ('fs');
const {render_upgrade} = require('./CustomRenderer');
const logger = require('./Logger');
const hljs   = require('highlight.js');


/**
 * Ajout d'un highlighter pour les balises <code>
 */
marked.setOptions({
    highlight: function(code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'shell';
        return hljs.highlight(code, { language }).value;
    }
});


/**
 * Return the title of the refcards to be created using his path
 * @param path
 * @returns *[]
 */
function getTitle(path) {
    const match = path.match(/(\.\.\/)(\w*)\/(\w*).md/);
    return [match[2],match[3]];
}

/**
 * Return the html code of a markdown file thanks to his path
 * @param path
 * @returns string
 */
function htmlGenerator(path){
    let title = getTitle(path);
    let text = fs.readFileSync(path, 'utf8');
    const HtmlBase = `<!DOCTYPE html>\n \n<html>\n \n   <head>\n     <title> ${title[0]} Refcard</title>\n        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/default.min.css">\n     <link rel='stylesheet' href='../css/style.css'>\n   </head>\n<body>\n`;
    return HtmlBase +marked(text, {renderer:render_upgrade(metadataExtractor(path))}) + "\n </body>\n </html>";
}

/**
 * Return the two specifics colors of a refcards thanks to his path
 * @param path
 * @returns {string[]}
 */
function metadataExtractor(path) {
    let text = fs.readFileSync(path,'utf-8');
    const match = text.match(/(\[\/\/\]: #) \(color1:(#\w*);color2:(#\w*);color3:(#\w*)\)/);
    return [match[2],match[3],match[4]];
}

/**
 * Create the html file associated to the refcard path on parameter
 * @param path
 */
function refcardCreator(path) {
    const pathStruct = {
        title : getTitle(path)
    }
    let text = htmlGenerator(path);
    fs.mkdir(`public/${pathStruct.title[0]}`, {recursive:true},function(err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(`Directory ${pathStruct.title[0]} created`)
        }
    })
    fs.writeFile(`public/${pathStruct.title[0]}/${pathStruct.title[0]}.${pathStruct.title[1]}.html`,text,function(err){
        if (err) throw err;
        logger.info(`Refcard ${pathStruct.title[0]} ${pathStruct.title[1]} generated!`);
    })
}

/**
 * Create all the refcards in the github repository
 * @param pathList
 * @constructor
 */
function CreateAllRefcards(pathList) {
    for (let pas=0; pas<pathList.length;pas++) {
        refcardCreator(pathList[pas])
    }
}


module.exports = {refcardCreator,metadataExtractor,htmlGenerator,getTitle,CreateAllRefcards};