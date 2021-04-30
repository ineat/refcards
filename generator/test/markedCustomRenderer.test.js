const marked = require('marked');
const {render_upgrade} = require("../generator/markedCustomRenderer");

describe('Test renderer upgraded', () => {
    it('should add class attribute to header token', () => {
        const header = marked("# test", {
            renderer: render_upgrade()
        })
        expect(header).toBe('<h1 class="class1" id="test">test</h1>\n');
    });

    it('should add class attribute to link token', () => {
        const link = marked("[test](test)", {
            renderer: render_upgrade()
        })
        expect(link).toBe('<p><a class="class1" href="test">test</a></p>\n');
    });

    it('should add class attribute to code token', () => {
        const code = marked("```sh\ntest\n```", {
            renderer: render_upgrade()
        })
        expect(code).toBe('<pre><code class="class1">test\n</code></pre>');
    });

    it('should add class attribute to codespan token', () => {
        const codespan = marked("`test`", {
            renderer: render_upgrade()
        })
        expect(codespan).toBe('<p><code class="class1">test</code></p>\n');
    });

    it('should add class attribute to blockquote token', () => {
        const blockquote = marked(">test", {
            renderer: render_upgrade()
        })
        expect(blockquote).toBe('<blockquote class="class1">\n<p>test</p>\n</blockquote>\n');
    });
});