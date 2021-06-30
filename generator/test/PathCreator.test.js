const pathCreator = require("../script/PathCreator");
const logger = require("../script/Logger");
const fs = require("fs");

describe('Test PathCreator', () => {
    logger.info("testing createPaths function");
    it('should extract the markdown files list', () => {
        const mdsList = pathCreator.createPaths();
        expect(mdsList.length).toBeGreaterThan(0);
    });

    logger.info("testing getAllRefcardsDirectories function")
    it('should return the list of directories containing refacrds', () => {
        const dirList = pathCreator.getAllRefcardsDirectories();
        const testDirList = fs.readdirSync("..");
        expect(dirList.length).toBeLessThan(testDirList.length);
    });
})
