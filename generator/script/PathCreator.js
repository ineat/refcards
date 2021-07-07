const fs = require('fs');

/**
 * return the list of the directories containing refcards
 * @returns {[fs.Dirent]}
 */
function getAllRefcardsDirectories() {
    const files = fs.readdirSync('..', { withFileTypes:true});
    let refcardDirectories = [];
    for (let pas of files) {
        if (pas.isDirectory() && pas.name !== ".idea" && pas.name !== "generator" && pas.name !== ".github") {
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

/**
 * Return an object "refcards" containing all the data to compile the handlebars template
 * @returns {{}}
 */
function createObject() {
    let objectList = {};
    objectList["refcards"] = [];
    const refcardList = getAllRefcardsDirectories();
    for (let pas of refcardList) {
        let dir = fs.readdirSync(`../${pas.name}`,{ withFileTypes:true});
        let cpt = 0;
        for (let refcardFile of dir) {
            if (refcardFile.name.endsWith(".md")) {
                cpt+=1;
                let copy = refcardFile.name;
                let name = refcardFile.name.replace(".md","");
                let path = copy.replace(".md",".html");
                objectList["refcards"].push({title : pas.name, name:name, path:`${pas.name}/${path}`,first: cpt === 1});
            }
        }
    }
    return objectList
}

module.exports = {createPaths,createObject,getAllRefcardsDirectories};
