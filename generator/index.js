const HtmlCreator = require("./script/HtmlCreator");
const PathCreator = require("./script/PathCreator");
const logger = require("./script/Logger");
const fs = require('fs');
const handlebars = require('handlebars');


const pathList = PathCreator.createPaths();
logger.info('Starting refcard generation');
HtmlCreator.CreateAllRefcards(pathList);


const objects = PathCreator.prepareHandlebarsContextObject();
const source = fs.readFileSync('./templates/index.hbs').toString();
const template = handlebars.compile(source,{strict:true});
const result = template(objects);
const outFile = "./public/index.html";

fs.writeFileSync(outFile,result);
logger.info("index.html generated");

