const marked = require('marked');
const {cleanUrl,escape} = require("marked/src/helpers");



/**
 * Modify the renderer to add html classes for the tokens in the function
 * @type renderer
 */
exports.render_upgrade = function (color) {
    const render = new marked.Renderer();

    render.link = function(href, title, text) {
        if (href === null) {
            return text;
        }
        let out = `<a class="links" style="color :${color[1]}" href="${href}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += `>${text}</a>`;
        return out;
    }

    render.blockquote = function(quote) {
        return `<blockquote class="blockquotes" style="color: ${color[1]}">\n${quote}</blockquote>\n`;
    }

    render.heading = function(text, level, raw, slugger) {
        if (this.options.headerIds) {
            return `<h${level} class="heading${level}" style="${color}" id="` + this.options.headerPrefix + slugger.slug(raw) + `">${text}</h${level}>\n`;
        }
        // ignore IDs
        return `<h${level} class="heading${level}" style="${color}">${text}</h${level}>\n`;
    }

    render.codespan = function(text) {
        return `<code class="codespan" style="color: ${color[1]}">${text}</code>`;
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

        return `<pre style="background-color: ${color[0]}"><code class="code">` + (escaped ? code:escape(code,true)) + `</code></pre>`;
    }

    render.image = function(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
            return text;
        }

        let out = `<img src="/git/${href}" style="${color}" alt="${text}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    }


    return render;

}


