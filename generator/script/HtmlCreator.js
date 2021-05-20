const marked = require('marked');
const fs =require ('fs');
const fse = require('fs-extra');
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
 * @returns string
 */
function getTitle(path) {
    const match = path.match(/(\.\.\/)(\w*)\//);
    return match[2];
}

/**
 * Return the html code of a markdown file thanks to his path
 * @param path
 * @returns string
 */
function htmlGenerator(path){
    return `<!DOCTYPE html>
<html lang="${getTitle(path)[1]}">
    <head>
        <title> ${getTitle(path)[0]} Refcard</title>
        <link rel='stylesheet' href='css/style.css'>
    </head>
    <body>
        ${marked(fs.readFileSync(path, 'utf8'), {renderer:render_upgrade(metadataExtractor(path))})}
    </body>
</html>
`;
}

function createFolder() {
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

}

/**
 * Return the two specifics colors of a refcards thanks to his path
 * @param path
 * @returns {string[]}
 */
function metadataExtractor(path) {
    let text = fs.readFileSync(path,'utf-8');
    const match = text.match(/\[\/\/\]: # \(\w*: (#\w*)\)/g);
    let res = []
    for (let pas=0;pas<match.length;pas++) {
        let int = match[pas].match(/\[\/\/\]: # \(\w*: (#\w*)\)/);
        res.push(int[1]);
    }
    return res;
}

/**
 * Create the html file associated to the refcard path on parameter
 * @param path
 */
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


module.exports = {createFolder,refcardCreator,metadataExtractor,htmlGenerator,getTitle};
const marked = require('marked');
const fs =require ('fs');
const fse = require('fs-extra');
const {render_upgrade} = require('./CustomRenderer');
const logger = require('./Logger');

function getTitle(path) {
    const match = path.match(/(\.\.\/)(\w*)\//);
    return match[2];
}

function htmlGenerator(path){
    return `<!DOCTYPE html>
<html lang="${getTitle(path)[1]}">
    <head>
        <title> ${getTitle(path)[0]} Refcard</title>
        <link rel='stylesheet' href='css/style.css'>
    </head>
    <body>
        ${marked(fs.readFileSync(path, 'utf8'), {renderer:render_upgrade(metadataExtractor(path))})}
    </body>
</html>
`;
}

function createFolder() {
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

}

function metadataExtractor(path) {
    let text = fs.readFileSync(path,'utf-8');
    const match = text.match(/\[\/\/\]: # \(\w*: (#\w*)\)/g);
    let res = {}
    for (let pas of match) {
        const [name] = pas.match(/\w+/);
        let [color] = pas.match(/#\w+/);
        let item = {[name]: color};
        Object.assign(res, item)
    }
    return res;
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


module.exports = {createFolder,refcardCreator,metadataExtractor,htmlGenerator,getTitle};
