const HtmlCreator = require("./script/HtmlCreator");
const PathCreator = require("./script/PathCreator");
const logger = require("./script/Logger")


const pathList = PathCreator.createPaths();
logger.info('Starting refcard generation');
HtmlCreator.CreateAllRefcards(pathList);

//button = document.createElement("button");
//button.innerHTML = "test";
//document.body.appendChild(button);