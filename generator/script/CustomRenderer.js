const marked = require('marked');
const {cleanUrl} = require("marked/src/helpers");
const module1 = require('../index');



/**
 * Modify the renderer to add html classes for the tokens in the function
 * @type renderer
 */
exports.render_upgrade = function (couleur) {
    const render = new marked.Renderer();

    render.link = function(href, title, text) {
        if (href === null) {
            return text;
        }
        let out = `<a class="links" style="${couleur}" href="${href}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += `>${text}</a>`;
        return out;
    }

    render.blockquote = function(quote) {
        return `<blockquote class="blockquotes" style="${couleur}">\n${quote}</blockquote>\n`;
    }

    render.heading = function(text, level, raw, slugger) {
        if (this.options.headerIds) {
            return `<h${level} class="class1" style="${couleur}" id="` + this.options.headerPrefix + slugger.slug(raw) + `">${text}</h${level}>\n`;
        }
        // ignore IDs
        return `<h${level} class="classe1" style="${couleur}">${text}</h${level}>\n`;
    }

    render.codespan = function(text) {
        return `<code class="class1" style="${couleur}">${text}</code>`;
    }

    render.code = function(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
            const out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return `<pre><code class="class1" style="${couleur}">${code}</code></pre>`;
        }

        return `<pre><code class="class1" style="${couleur}">${code}</code></pre>`;
    }

    render.image = function(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
            return text;
        }

        let out = `<img src="../git/${href}" style="${couleur}" alt="${text}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    }

    return render;

}


