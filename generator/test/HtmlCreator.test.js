const logger = require("../script/Logger");
const htmlCreator = require("../script/HtmlCreator");

describe('Test htmlCreator', () => {
    logger.info("testing getTitle function");
    it('should extract the title of the refcard from the path', () => {
        const header = htmlCreator.getTitle('../git/FR.md');
        expect(header).toBe("git");
    });

    logger.info("testing metadataExtractor function");
    it('should extract the metadata of the refcard from the path', () => {
        const metadata = htmlCreator.metadataExtractor('../git/FR.md');
        expect(metadata).toEqual(jasmine.objectContaining({main_color:"#fde8de",second_color:"#ef3428",third_color:"#3c2e16"}));
    });

})
