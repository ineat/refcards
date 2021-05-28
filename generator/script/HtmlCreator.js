const marked = require('marked');
const fs =require ('fs');
const fse = require('fs-extra');
const {render_upgrade} = require('./CustomRenderer');
const logger = require('./Logger');
const hljs   = require('highlight.js');


/**
 * Add an highlighter for the tokens <code>
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
 * @returns [string]
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
    return `<!DOCTYPE html>
<html lang=${getTitle(path)[1]}>
    <head>
        <title> ${getTitle(path)[0]} Refcard</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/default.min.css">
        <link rel='stylesheet' href='../css/style.css'>
    </head>
    <body>
        ${marked(fs.readFileSync(path, 'utf8'),{renderer:render_upgrade(metadataExtractor(path))})}
    </body>
</html>
`;
}


/**
 * Create a folder with the name of the refcard extracted from the path
 */
function createFolder(path) {
    fs.mkdir(`public/${getTitle(path)[0]}/assets`, (err) => {
        logger.info(`Directory ${getTitle(path)[0]}/assets created!`);
    });
    try {
        fse.copySync(`../${getTitle(path)[0]}/assets`, `public/${getTitle(path)[0]}/assets`, {overwrite: true});
        logger.info(`assets copied from ../${getTitle(path)[0]}/assets`)
    } catch (err) {
        if (err) throw err;
    }

}


/**
 * Return the three specifics colors of a refcards thanks to his path
 * @param path
 * @returns {{main_color: string, second_color: string, third_color: string}}
 */
function metadataExtractor(path) {
    let text = fs.readFileSync(path,'utf-8');
    const match = text.match(/\[\/\/\]: # \(\w*: (#\w*)\)/g);
    let res = {}
    if (match) {
        for (let pas of match) {
            const [name] = pas.match(/\w+/);
            let [color] = pas.match(/#\w+/);
            let item = {[name]: color};
            Object.assign(res, item)
        }

        return res;
    }
    return {
        main_color: "#B2F2F4",
        second_color: "#43B44B",
        third_color: "#447BBB"
    };
}

/**
 * Create the html file associated to the refcard path on parameter
 * @param path
 */
function refcardCreator(path) {
    const titleElement = getTitle(path)[0];
    const refcardLang = getTitle(path)[1];
    const files = fs.readdirSync(`../${titleElement}`, { withFileTypes:true});
    let isAssetsPresents = false;
    for (let pas of files) {
        if (pas.name !== undefined && pas.name === "assets") {
            isAssetsPresents = true;
        }
    }
    let text = htmlGenerator(path);
    fs.mkdir(`public/${titleElement}`, (err) => {
        logger.info(`Directory ${titleElement} created`);
    });
    if (isAssetsPresents) {
        createFolder(path);
    }
    fs.writeFile(`public/${titleElement}/${refcardLang}.html`,text,function(err){
        if (err) throw err;
        logger.info(`Refcard ${titleElement} ${refcardLang} generated!`);
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

module.exports = {CreateAllRefcards,createFolder,refcardCreator,metadataExtractor,htmlGenerator,getTitle};
