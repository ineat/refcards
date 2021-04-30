const marked = require('marked');
const {cleanUrl} = require("marked/src/helpers");

// return a custom renderer for marked.
exports.render_upgrade = function () {

    const render = new marked.Renderer();

    render.link = function(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
            return text;
        }
        let out = '<a class="class1" href="' + escape(href) + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    }

    render.blockquote = function (quote) {
        return '<blockquote class="class1">\n' + quote + '</blockquote>\n';
    }

    render.heading = function (text, level, raw, slugger) {
        if (this.options.headerIds) {
            return '<h'
                + level
                + ' class="class1" id="'
                + this.options.headerPrefix
                + slugger.slug(raw)
                + '">'
                + text
                + '</h'
                + level
                + '>\n';
        }
        // ignore IDs
        return '<h' + level + 'class="classe1">' + text + '</h' + level + '>\n';
    }

    render.codespan = function  codespan(text) {
        return '<code class="class1">' + text + '</code>';
    }

    render.code = function code(code, infostring, escaped) {
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
            return '<pre><code class="class1">'
                + code
                + '</code></pre>';
        }

        return '<pre><code class="'
            + "class1"
            + '">'
            + code
            + '</code></pre>';
    }

    return render;

};



