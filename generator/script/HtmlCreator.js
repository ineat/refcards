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
    let title = getTitle(path);
    let text = fs.readFileSync(path, 'utf8');
    const HtmlBase = `<!DOCTYPE html>\n \n<html>\n \n   <head>\n     <title> ${title} Refcard</title>\n     <link rel='stylesheet' href='css/style.css'>\n   </head>\n<body>\n`;
    return HtmlBase +marked(text, {renderer:render_upgrade(metadataExtractor(path))}) + "\n </body>\n </html>";
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
    const match = text.match(/(\[\/\/\]: #) \(color1:(#\w*);color2:(#\w*)\)/);
    return [match[2],match[3]];
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
