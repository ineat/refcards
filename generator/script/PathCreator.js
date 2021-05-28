const fs = require('fs');

/**
 * return the list of the directories containing refcards
 * @returns {[fs.Dirent]}
 */
function getAllRefcardsDirectories() {
    const files = fs.readdirSync('..', { withFileTypes:true});
    let refcardDirectories = [];
    for (let pas of files) {
        if (pas.isDirectory() && pas.name !== ".idea" && pas.name !== "generator") {
            refcardDirectories.push(pas);
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
    for (let refcardDir of refcardList) {
        let dir = fs.readdirSync(`../${refcardDir.name}`,{ withFileTypes:true});
        for (let refcardFiles of dir) {
            if (refcardFiles.name.endsWith(".md")) {
                pathList.push(`../${refcardDir.name}/${refcardFiles.name}`);
            }
        }
    }
    return pathList
}

module.exports = {createPaths};
