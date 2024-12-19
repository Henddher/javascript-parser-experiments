@builtin "whitespace.ne"
@builtin "string.ne"

@{%
let DEBUG = false;

// TODO: change order of params and put 'tag' first, default `callback=(d)=>d`
// so `_trace(tag)`. Use Function.bind
function _trace(d, callback, tag="") {
    if (!DEBUG) {
        return callback(d);
    }

    console.log(`<<<< ${tag}`);
    console.log(d);
    let res = callback(d);
    console.log(">>>>");
    console.log(res);
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
    EOF: /<EOF>/, // Must match const in parsers (TODO: move both to another .js file)
    colons2xplus: /::+/,
    // any_but_2xcolon: {match: /[^:][^:]*?/, lineBreaks: true}, // non-greedy
    colon: /:/, // one colon
    // markup_kw: /[a-zA-Z0-9-]+/,
    // open_curly: /\{/,
    // close_curly: /}/,
    // any_but_2xcolon: {match: /[^:][^:]*?/, lineBreaks: true}, // non-greedy
    // any_but_colon: {match: /[^:]/, lineBreaks: true}, // non-greedy
    any_but_colon: {match: /[^:]/, lineBreaks: true},
    // any: {match: /./, lineBreaks: true},
    // EOF: /.$/, // doesn't work
});

// https://github.com/no-context/moo/issues/64
// const itt = require('itt')
// const tokens = itt.push({ type: 'eof', value: '<eof>' }, lexer)
// for (const tok of tokens) {
//   console.log(tok)
// }
%}

@lexer lexer

all -> 
    %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
    | all %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}

    | ":" {% (d) => _trace(d, d=>d, "trace") %}
    | all ":" {% (d) => _trace(d, d=>d, "trace") %}

    | colons_etc {% (d) => _trace(d, d=>d, "trace") %}
    | all colons_etc {% (d) => _trace(d, d=>d, "trace") %}

colons_etc -> 
    %colons2xplus __ {% (d) => _trace(d, d=>d, "trace") %}
    | %colons2xplus markup_def {% (d) => _trace(d, d=>d[1], "markup") %}

# content -> 
#     # markup_line {% (d) => _trace(d, d=>d, "trace") %}
#     # | content markup_line {% (d) => _trace(d, d=>d, "trace") %}

#     %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
#     | content %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
    
#     | ":" {% (d) => _trace(d, d=>d, "trace") %}
#     | content ":" {% (d) => _trace(d, d=>d, "trace") %}

#     # | content colons {% (d) => _trace(d, d=>d, "trace") %} # ❌
#     | colons_etc {% (d) => _trace(d, d=>d, "trace") %}
#     # | content colons_etc {% (d) => _trace(d, d=>d, "trace") %}
#     # | colons {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous

#     # | ":" ":" markup_line {% (d) => _trace(d, d=>d, "trace") %}
#     # | content ":" ":" markup_line {% (d) => _trace(d, d=>d, "trace") %}

# ✅
# Always use {% (d) => _trace(d, d=>d, "trace") %} as processor

# colons_etc -> 
#     colons markup_line {% (d) => _trace(d, d=>d, "trace") %}
#     # colons markup_line:? {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous

#     # | colons {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous
#     # | colons_etc colons {% (d) => _trace(d, d=>d, "trace") %} # ✅

#     # | ":" {% (d) => _trace(d, d=>d, "trace") %}
#     # | colons_etc ":" {% (d) => _trace(d, d=>d, "trace") %}

#     # | colons _ {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous
#     # | colons colons_etc {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous
#     # | colons {% (d) => _trace(d, d=>d, "trace") %} # ❌ ambiguous

# # colons must be right-associative
# colons -> ":" colons:? {% (d) => _trace(d, d=>d, "trace") %}
#     | %colon2x colons:? {% (d) => _trace(d, d=>d, "trace") %}
#     # | colons _ {% (d) => _trace(d, d=>d, "trace") %} # ❌⏳
#     | colons end
# # colons -> ":" (_ colons):? {% (d) => _trace(d, d=>d, "trace") %} # 🤷🏻‍♂️
# #     | %colon2x (_ colons):? {% (d) => _trace(d, d=>d, "trace") %} # 🤷🏻‍♂️

end -> %EOF

# markup_line -> markup_def {% (d) => _trace(d, d=>d[0], "markup_line") %}

markup_def -> markup_kw "{" _ markup_attrs "}" {% (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def") %}
    # | _ {% (d) => _trace(d, d=>d, "trace") %} # ❌⏳

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}

plaintext -> [^:]:+ {% (d) => _trace(d, d=>idjoiner(d), "plaintext") %}