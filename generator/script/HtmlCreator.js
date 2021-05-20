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
    let res = []
    for (let pas=0;pas<match.length;pas++) {
        let int = match[pas].match(/\[\/\/\]: # \(\w*: (#\w*)\)/);
        res.push(int[1]);
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