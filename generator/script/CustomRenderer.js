const marked = require('marked');
const {cleanUrl} = require("marked/src/helpers");
const escape = require('escape-html');

const MAIN_COLOR_INDEX = 0;
const SECOND_COLOR_INDEX = 1;
const THIRD_COLOR_INDEX = 2;


const MAIN_COLOR_KEY= "main_color";
const SECOND_COLOR_KEY= "second_color";
const THIRD_COLOR_KEY= "third_color";
/**
 * Modify the renderer to add html classes for the tokens in the function and add style properties using the colors in parameters
 * @param color_items an object containing the key / value colors
 * @type renderer
 */
exports.render_upgrade = function (color_items) {
    const render = new marked.Renderer();
    const first_color = color_items[MAIN_COLOR_KEY];
    const second_color = color_items[SECOND_COLOR_KEY];
    const third_color = color_items[THIRD_COLOR_KEY];
    render.link = function(href, title, text) {
        if (href === null) {
            return text;
        }
        return `<a class="links" style="color :${color[SECOND_COLOR_INDEX]}" href="${href}" title="${title ? title : ""}">${text}</a>`;
    }

    render.blockquote = function(quote) {
        return `<blockquote class="blockquotes" style="color: ${color[SECOND_COLOR_INDEX]};border-left: ${color[SECOND_COLOR_INDEX]} solid;">\n${quote}</blockquote>\n`;
    }

    render.heading = function(text, level, raw, slugger) {
        if (this.options.headerIds) {
            let html = this.options.headerPrefix + slugger.slug(raw);
            if (level === 2) {
                return `</div>\n
                        <div class="h2-part">\n
                            <h${level} class="heading${level}" style="color: ${color[SECOND_COLOR_INDEX]}" id="${html}"><a class="anchor" href="#${html}"><img src="../assets/anchor.svg" alt></a>${text}</h${level}>\n`;
            } else {
                return `<h${level} class="heading${level}" style="color: ${color[SECOND_COLOR_INDEX]}" id="${html}"><a class="anchor" href="#${html}"><img src="../assets/anchor.svg" alt></a>${text}</h${level}>\n`;
            }
        }
        // ignore IDs
        return `</div>\n
                <div class="h2-part">\n
                    <h${level} class="heading${level}" style="color: ${color[SECOND_COLOR_INDEX]}">${text}</h${level}>\n`;
    }

    render.codespan = function(text) {
        return `<code class="codespan" style="color: ${color[SECOND_COLOR_INDEX]}">${text}</code>`;
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
        return `<pre style="background-color: ${color[MAIN_COLOR_INDEX]}"><code class="code" style="color: ${color[THIRD_COLOR_INDEX]}">${escaped ? code:escape(code)}</code></pre>`;
    }

    render.image = function(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
            return text;
        }
        return `<img src="${href}" alt="${text}" title="${title ? title : ""}"${this.options.xhtml ? '/>' : '>'}`;
    }


    return render;

}


