const logger = require("../script/Logger");
const htmlCreator = require("../script/HtmlCreator");
const fs = require("fs");

describe('Test htmlCreator', () => {
    logger.info("testing getTitle function");
    it('should extract the title of the refcard from the path', () => {
        const header = htmlCreator.getTitle('../git/FR.md');
        expect(header).toEqual(["git","FR"]);
    });

    logger.info("testing metadataExtractor function");
    it('should extract the metadata of the refcard from the path', () => {
        const metadata = htmlCreator.metadataExtractor('../git/FR.md');
<<<<<<< HEAD
        expect(metadata).toEqual(jasmine.objectContaining({main_color:"#fde8de",second_color:"#ef3428",third_color:"#3c2e16"}));
=======
        expect(metadata).toEqual(["#fde8de","#ef3428","#3c2e16"]);
>>>>>>> 5c7af29 (feat(generator): ajout de la génération de toutes les refcards d'un coup)
    });

    logger.info("testing createFolder fonction");
    it('should create a folder with the name of the refcard extracted from the path', () => {
        const path = `../git/FR.md`
        const titreElement = htmlCreator.getTitle(path)[0];
        htmlCreator.createFolder(path)
        const folder = fs.readdirSync(`public/${titreElement}`);
        expect(folder[0]).toEqual(`assets`);
    })
})
