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

# all -> text all # ❌ (no results)
# text -> [^:]

# all -> text all # ❌ (no results)
# text -> [^:]:+
#     | null

# all -> text all # ❌
#     | null
# text -> [^:]:+

# all -> text all # ❌ (no results)
# text -> [^:]:+

# all -> text:* # ❌
# text -> [^:]:+

# all -> text # ✅
# text -> [^:]:+

# final -> line

# test -> %any_but_2xcolon {% (d) => _trace(d, d=>d, "test") %} # ❌ (parseError on 2nd letter)

# test -> %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %} # ❌ (no results, but when EOF is fed, parseError)

# test -> %EOF # ✅ (no ambiguity. <EOF> must be fed)
#     | %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF # ❌ (parser error on the 2nd letter)
#     | %any_but_2xcolon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF # ✅ (no ambiguity. <EOF> must be fed) # still end w/ : fails.
#     | %colon_2plus markup_def test
#     | %colon %any_but_2xcolon test
#     | %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF # ❌ (no ambiguity. <EOF> must be fed) loops forever on plain:text
#     | %colon_2plus markup_def test
#     | %colon %any_but_2xcolon test
#     | %any_but_2xcolon %colon test # {% (d) => _trace(d, d=>d, "test") %}
#     | %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} ❌ (no ambiguity. <EOF> must be fed) fails with :plaintext, plaintext: and :plaintext:
#     | %colon_2plus markup_def test {% (d) => _trace(d, d=>d, "test") %}
#     | %any_but_2xcolon %colon %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %}
#     | %any_but_2xcolon test {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ❌ syntax error on 2nd letter
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | %any_but_colon {% (d) => _trace(d, d=>d, "test") %}
#     # | %colon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ❌ syntax error on 1st letter
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | test %any_but_colon {% (d) => _trace(d, d=>d, "test") %}
#     # | %colon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ✅ no ambiguity, lexer error on :
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | %any_but_colon:+ {% (d) => _trace(d, d=>d, "test") %}
#     # | %colon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ✅ no ambiguity, lexer error on :
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | %any_but_colon:+ {% (d) => _trace(d, d=>d, "test") %}
#     | %any_but_colon:+ %colon {% (d) => _trace(d, d=>d, "test") %}
#     # | %colon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ❌ ambiguity
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | %any_but_colon:+ {% (d) => _trace(d, d=>d, "test") %}
#     | test %any_but_colon:+ {% (d) => _trace(d, d=>d, "test") %}
#     | %colon {% (d) => _trace(d, d=>d, "test") %}

# test -> %EOF {% (d) => _trace(d, d=>d, "test") %} # ❌ no results
#     # | %colon_2plus markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
#     | plain test {% (d) => _trace(d, d=>d, "test") %}
#     | ":" {% (d) => _trace(d, d=>d, "test") %}
# plain -> %any_but_colon:+

# --- 

# Don't use @lexer (w/ and w/o EOF)
# Use moo's error (with token?)

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅ok ✅plaintext: ❌:plaintext ✅plain:text ❌:plaintext:
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     | plaintext ":" plaintext {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
#     # | ":" line {% (d) => _trace(d, d=>d, "line :") %}

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅ok ❌plain:text ❌plaintext: ❌:plaintext
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     # | plaintext ":" line {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
#     | ":" line {% (d) => _trace(d, d=>d, "line :") %}

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅ok ✅plain:text ❌plaintext: ❌:plaintext
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     # | plaintext ":" plaintext {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
#     | ":" line {% (d) => _trace(d, d=>d, "line :") %}

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅ok ✅plaintext: ✅:plaintext ✅plain:text ❌:plaintext:
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     | plaintext ":" plaintext {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
#     # | ":" line {% (d) => _trace(d, d=>d, "line :") %}

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅ok ✅plaintext: ✅:plaintext ✅plain:text ❌:plaintext: ❌:plain:te:xt:
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     | plaintext ":" plaintext {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
#     # | ":" line {% (d) => _trace(d, d=>d, "line :") %}

# line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %} # ✅plaintext ❌::?? because of plaintext
#     | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
#     | line ":" plaintext {% (d) => _trace(d, d=>d, "line plainline : plainline") %}
#     # | ":" line {% (d) => _trace(d, d=>d, "line :") %}

content -> markup_line {% (d) => _trace(d, d=>d, "markup_line") %}
    | %any_but_colon:+ ":":* {% (d) => _trace(d, d=>d, "markup_line") %}
    # | ":" {% (d) => _trace(d, d=>d, "markup_line") %}
    # | markup_pad {% (d) => _trace(d, d=>d, "markup_line") %}

markup_line -> %colon2x markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}
# markup_pad -> ":":+

colons -> "::":+

markup_def -> markup_kw "{" _ markup_attrs "}" {% (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def") %}

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}

plaintext -> [^:]:+ {% (d) => _trace(d, d=>idjoiner(d), "plaintext") %}