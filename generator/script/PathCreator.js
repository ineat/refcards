const fs = require('fs');

/**
 * return the list of the directories containing refcards
 * @returns {[fs.Dirent]}
 */
function getAllRefcardsDirectories() {
    const files = fs.readdirSync('..', { withFileTypes:true});
    let refcardDirectories = [];
    for (let pas=1; pas<files.length; pas++) {
        if ((files[pas].isDirectory())&&(files[pas].name!==".idea")&&(files[pas].name!=="generator")) {
            refcardDirectories.push(files[pas]);
        }
    }
    return refcardDirectories;
}


/**
 * Return the list of all the path who point on a refcard
 * @returns {[String]}
 */
function createPaths() {
    let pathList = [];
    const refcardList = getAllRefcardsDirectories();
    for (let pas=0; pas<refcardList.length;pas++) {
        let dir = fs.readdirSync(`../${refcardList[pas].name}`,{ withFileTypes:true});
        for (let pas2=0; pas2<dir.length;pas2++) {
            if (dir[pas2].name.endsWith(".md")) {
                pathList.push(`../${refcardList[pas].name}/${dir[pas2].name}`);
            }
        }
    }
    return pathList
}

/**
 * Return an object "refcards" containing all the data to compile the handlebars template
 * @returns {{}}
 */
function createObject() {
    let objectList = {};
    objectList["refcards"] = [];
    const refcardList = getAllRefcardsDirectories();
    for (let pas=0; pas<refcardList.length;pas++) {
        let dir = fs.readdirSync(`../${refcardList[pas].name}`,{ withFileTypes:true});
        let cpt = 0;
        for (let pas2=0; pas2<dir.length;pas2++) {
            if (dir[pas2].name.endsWith(".md")) {
                cpt+=1;
                let copy = dir[pas2].name;
                let name = dir[pas2].name.replace(".md","");
                let path = copy.replace(".md",".html");
                if (cpt === 1) {
                    objectList["refcards"].push({title : refcardList[pas].name, name:name, path:`${refcardList[pas].name}/${path}`,first:true});
                }
                else{
                    objectList["refcards"].push({title : refcardList[pas].name, name:name, path:`${refcardList[pas].name}/${path}`,first:false});
                }
            }
        }
    }
    return objectList
}

module.exports = {createPaths,createObject};