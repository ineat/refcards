const pathCreator = require("../script/PathCreator");

describe('Test PathCreator', () => {
    it('should extract the markdown files list', () => {
        var mdsList = pathCreator.createPaths();
        expect(mdsList.length).toBeGreaterThan(0)
    });
})
