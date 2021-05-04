const marked = require('marked');
const {render_upgrade} = require("../script/CustomRenderer");
const logger = require("../index");

describe('Test renderer upgraded', () => {
    logger.info("testing header token");
    it('should add class attribute to header token', () => {
        const header = marked("# test", {
            renderer: render_upgrade()
        })
        expect(header).toBe('<h1 class="class1" id="test">test</h1>\n');
    });

    logger.info("testing link token");
    it('should add class attribute to link token', () => {
        const link = marked("[test](testé)", {
            renderer: render_upgrade()
        })
        expect(link).toBe('<p><a class="class1" href="testé">test</a></p>\n');
    });

    logger.info("testing code token");
    it('should add class attribute to code token', () => {
        const code = marked("```sh\ntest\n```", {
            renderer: render_upgrade()
        })
        expect(code).toBe('<pre><code class="class1">test\n</code></pre>');
    });

    logger.info("testing codespan token");
    it('should add class attribute to codespan token', () => {
        const codespan = marked("`test`", {
            renderer: render_upgrade()
        })
        expect(codespan).toBe('<p><code class="class1">test</code></p>\n');
    });

    logger.info("testing blockquote token");
    it('should add class attribute to blockquote token', () => {
        const blockquote = marked(">test", {
            renderer: render_upgrade()
        })
        expect(blockquote).toBe('<blockquote class="class1">\n<p>test</p>\n</blockquote>\n');
    });

    logger.info("testing image token");
    it('should add class attribute to image token', () => {
        const image = marked("![test](test.png)", {
            renderer: render_upgrade()
        })
        expect(image).toBe('<p><img src="test.png" alt="test"></p>\n');
    });
});