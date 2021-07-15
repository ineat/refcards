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
        const language = hljs.getLanguage(lang) ? lang : 'shell';
        return hljs.highlight(code, { language }).value;
    }
});


/**
 * Return the title and the language of the refcards to be created using his path
 * @param path
 * @returns [string]
 */
function getTitle(path) {
    const match = path.match(/(\.\.\/)(\w*)\/(\w*).md/);
    return [match[2],match[3]];
}


/**
 * Return a div containing the different langages availables
 * @param path
 * @returns {string}
 */
function createDivInternationalization (path){
    const refcardTitle = getTitle(path)[0];
    const refcardLang = getTitle(path)[1];
    if (refcardLang === "EN") {
        return`<div class="internationalization">
        <img src="../assets/${refcardLang}.png" alt="${refcardLang} flag">
            <select onchange="location= this.value">
                <option selected>${refcardLang}</option>
                <option value="FR.html">FR</option>
            </select>
    </div>`
    } else {
        const englishAvailable = fs.existsSync(`public/${refcardTitle}/EN.html`);
        if (englishAvailable) {
            return `<div class="internationalization">
        <img src="../assets/${refcardLang}.png" alt="${refcardLang} flag">
            <select onchange="location= this.value">
                <option selected>${refcardLang}</option>
                <option value="EN.html">EN</option>
            </select>
    </div>`
        }
        else {
            return `<div class="internationalization">
        <img src="../assets/${refcardLang}.png" alt="${refcardLang} flag">
            <select onchange="location= this.value">
                <option selected>${refcardLang}</option>
            </select>
    </div>`
        }
    }

}


/**
 * Return the html code of a markdown file thanks to his path
 * @param path
 * @returns string
 */
function htmlGenerator(path){
    const titleElement = getTitle(path)[0];
    const refcardLang = getTitle(path)[1];
    const divInternationalization = createDivInternationalization(path);
    return `<!DOCTYPE html>
<html lang=${refcardLang}>
    <head>
        <title> ${titleElement} Refcard</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/default.min.css">
        <link rel='stylesheet' href='../css/refcards-style.css'>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <script src="../script/ScrollMagic.js"></script>
    </head>
    <body>
    <div class="first-page" style="background-color: ${metadataExtractor(path).second_color}">
        <div class="buttons">
            <a href="../index.html">
                <img src="../assets/back-logo.svg" alt="fleche retour">
            </a>
            <a href="https://github.com/ineat/refcards/discussions/new" class="hide_mobile">Une erreur ? Une question ? Éditer cette page sur Github</a>
            <a class="github-button" href="https://github.com/ineat/refcards" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star ineat/refcards on GitHub">Star</a>
            ${divInternationalization}
        </div>
        <img src="" alt="">
        <div class="band">
            <img src="assets/logo-${getTitle(path)[0]}.png" alt="logo ${getTitle(path)[0]}">
            <img src="../assets/ineat-logo.svg" alt="logo ineat">
        </div>
        <a href="https://github.com/ineat/refcards">
            <img src="../assets/github_fabbutton.svg" alt="logo github" id="github">
        </a>
    </div>
    <div class="buttons-on-page">
        <a href="../index.html">
            <img src="../assets/back-logo-black.svg" alt="fleche retour">
        </a>
        <a href="https://github.com/ineat/refcards/discussions/new" class="hide_mobile">Une erreur ? Une question ? Éditer cette page sur Github</a>
        <a class="github-button" href="https://github.com/ineat/refcards" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star ineat/refcards on GitHub">Star</a>
        <div class="little-menu">
            <img src="assets/logo-${getTitle(path)[0]}.png" alt="logo ${getTitle(path)[0]}">
        </div>
        ${divInternationalization}
    </div>
        ${marked(fs.readFileSync(path, 'utf8'), {renderer: render_upgrade(metadataExtractor(path))})}
        </div>
        <script defer src="../script/SceneCreator.js"></script>
    </body>
</html>
`;
}


/**
 * Create a folder with the name of the refcard extracted from the path and copy assets from the path into this folder
 */
function createFolder(path) {
    const titleElement = getTitle(path)[0];
    const directory = fs.existsSync(`public/${titleElement}`);
    if (!directory) {
        fs.mkdir(`public/${titleElement}/assets`, (err) => {
            logger.info(`Directory ${titleElement}/assets created!`);
        });
    }
    try {
        fse.copySync(`../${titleElement}/assets`, `public/${titleElement}/assets`, {overwrite: true});
        logger.info(`assets copied from ../${titleElement}/assets`)
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
        second_color: "#FC2860",
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
    for (let file of files) {
        if (file.name !== undefined && file.name === "assets") {
            isAssetsPresents = true;
        }
    }
    let text = htmlGenerator(path);
    const publicDirectory = fs.readdirSync('public');
    let directoryAlreadyExist = false;
    for (let directory of publicDirectory) {
        if (directory.name === `${titleElement}`) {
            directoryAlreadyExist = true;
        }
    }
    if (!directoryAlreadyExist) {
        fs.mkdir(`public/${titleElement}`, (err) => {
            logger.info(`Directory ${titleElement} created`);
        });
    }
    if (isAssetsPresents) {
        createFolder(path);
    }
    fs.writeFile(`public/${titleElement}/${refcardLang}.html`,text,function(err){
        if (err) throw err;
        logger.info(`Refcard ${titleElement} ${refcardLang} generated!`);
    })
}

/**
 * Create all the refcards in the github repository and copy assets used by every html pages
 * @param pathList
 */
function CreateAllRefcards(pathList) {
    if (!fs.existsSync(`public/assets`)) {
        fs.mkdir(`public/assets}`, (err) => {
            logger.info(`Directory assets created`);
        });
    }
    fse.copySync(`assets`,`public/assets`,{overwrite:true});
    logger.info(`global assets copied`)
    if (!fs.existsSync(`public/script`)) {
        fs.mkdir(`public/script`, (err) => {
            logger.info(`Directory script created`);
        });
    }
    fse.copySync(`script/front-script`, `public/script`, {overwrite: true});
    logger.info(`scripts copied from script/front-script`)
    for (let path of pathList) {
        refcardCreator(path)
    }
}

module.exports = {CreateAllRefcards,createFolder,refcardCreator,metadataExtractor,htmlGenerator,getTitle};