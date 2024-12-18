@builtin "whitespace.ne"
@builtin "string.ne"

@{%
let DEBUG = false;

// TODO: change order of params and put 'tag' first, default `callback=(d)=>d`
// so `_trace(tag)`. Use Function.bind
function _trace(d, callback, tag="") {
    let log = () => {};

    if (DEBUG) {
        log = console.log
    }

    log(`<<<< ${tag}`);
    log(JSON.stringify(d, null, 2));
    let res = callback(d);
    log(">>>>");
    log(JSON.stringify(res, null, 2));
    return res;
}

function newMarkupAttribute(attrName, attrValue) {
    let attr = {};
    attr[attrName] = attrValue;
    return attr;
}

function idjoiner(d) {
    return id(d).join("");
}

const noopRenderer = (_attrs) => "";

const _s = (text) => text || "";

const MARKUP_RENDERERS = {
    "quoted-text": (attrs) => {
        if (!attrs?.quote && !attrs?.author) {
            return "";
        }
        return `${_s(attrs?.quote)} - by ${_s(attrs?.author)}`;
    },
    "row": noopRenderer,
}

function renderMarkup(markupKw, markupAttrs) {
    let renderer = MARKUP_RENDERERS[markupKw] || JSON.stringify;
    let attrs = Object.assign({}, ...markupAttrs);
    return renderer(attrs);
}

const moo = require("moo");
const lexer = moo.compile({
    // EOF: /$/, // won't compile because it matches empty string
    // EOF: /<EOF>/,
    colon2x: /::/,
    // any_but_2xcolon: {match: /[^:][^:]*?/, lineBreaks: true}, // non-greedy
    colon: /:/, // one colon
    // markup_kw: /[a-zA-Z0-9-]+/,
    // open_curly: /\{/,
    // close_curly: /}/,
    // any_but_2xcolon: {match: /[^:][^:]*?/, lineBreaks: true}, // non-greedy
    // any_but_colon: {match: /[^:]/, lineBreaks: true}, // non-greedy
    any_but_colon: {match: /[^:]/, lineBreaks: true},
    // any: {match: /./, lineBreaks: true},
});

// https://github.com/no-context/moo/issues/64
// const itt = require('itt')
// const tokens = itt.push({ type: 'eof', value: '<eof>' }, lexer)
// for (const tok of tokens) {
//   console.log(tok)
// }
%}

@lexer lexer

content -> markup_line {% (d) => _trace(d, d=>d, "trace") %}
    | content markup_line {% (d) => _trace(d, d=>d, "trace") %}
    | %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
    | content %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
    | ":" {% (d) => _trace(d, d=>d, "trace") %}
    | content ":" {% (d) => _trace(d, d=>d, "trace") %}

# ✅
# Always use `{% (d) => _trace(d, d=>d), "trace") %}` as processor

markup_line -> %colon2x markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
    # | %colon2x {% (d) => _trace(d, d=>d, "trace") %} # ❌⏳
    # | markup_line %colon2x {% (d) => _trace(d, d=>d, "trace") %} # ❌
    # | markup_line ":" {% (d) => _trace(d, d=>d, "trace") %} # ❌
    # | %colon2x markup_line {% (d) => _trace(d, d=>d, "trace") %} # ❌ 

markup_def -> markup_kw "{" _ markup_attrs "}" {% (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def") %}
    # | _ {% (d) => _trace(d, d=>d, "trace") %} # ❌⏳

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}

plaintext -> [^:]:+ {% (d) => _trace(d, d=>idjoiner(d), "plaintext") %}