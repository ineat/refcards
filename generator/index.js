const HtmlCreator = require("./script/HtmlCreator");
const PathCreator = require("./script/PathCreator");
const logger = require("./script/Logger")


const pathList = PathCreator.createPaths();
logger.info('Starting refcard generation');
HtmlCreator.CreateAllRefcards(pathList);

module.exports = logger;