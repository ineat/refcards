const HtmlCreator = require("./script/HtmlCreator");

const path = "../git/FR.md";
HtmlCreator.createFolder();
HtmlCreator.refcardCreator(path);
