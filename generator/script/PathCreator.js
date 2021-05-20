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

module.exports = {createPaths};