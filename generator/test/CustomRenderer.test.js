const marked = require('marked');
const logger = require("../index");
const {render_upgrade} = require('../script/CustomRenderer');

describe('Test renderer upgraded', () => {
    logger.info("testing header token");
    it('should add class attribute to header token', () => {
        const header = marked("# test",{renderer:render_upgrade("red")})
        expect(header).toBe('<h1 class="heading1" style="red" id="test">test</h1>\n');
    });

    logger.info("testing link token");
    it('should add class attribute to link token', () => {
        const link = marked("[test](test)",{renderer:render_upgrade("red")})
        expect(link).toBe('<p><a class="links" style="red" href="test">test</a></p>\n');
    });

    logger.info("testing code token");
    it('should add class attribute to code token', () => {
        const code = marked("```sh\ntest\n```",{renderer:render_upgrade("red")})
        expect(code).toBe('<pre><code class="code" style="red">test\n</code></pre>');
    });

    logger.info("testing codespan token");
    it('should add class attribute to codespan token', () => {
        const codespan = marked("`test`",{renderer:render_upgrade("red")})
        expect(codespan).toBe('<p><code class="codespan" style="red">test</code></p>\n');
    });

    logger.info("testing blockquote token");
    it('should add class attribute to blockquote token', () => {
        const blockquote = marked(">test",{renderer:render_upgrade("red")})
        expect(blockquote).toBe('<blockquote class="blockquotes" style="red">\n<p>test</p>\n</blockquote>\n');
    });

    logger.info("testing image token");
    it('should add class attribute to image token', () => {
        const image = marked("![test](test.png)",{renderer:render_upgrade("red")})
        expect(image).toBe('<p><img src="git/test.png" style="red" alt="test"></p>\n');
    });

});