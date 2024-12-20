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
const jsonRenderer = (_attrs) => {
    // Force output to be deterministic.
    // CAVEAT: if _attrs was not a flat Object, this
    // would NOT work (e.g. {a:{b:"1", c:"2"}} != {a:{c:"2", b:"1"}})
    return JSON.stringify(
        Object.fromEntries(Object.entries(_attrs).sort())
    );
};

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
    let renderer = MARKUP_RENDERERS[markupKw] || jsonRenderer;
    let attrs = Object.assign({}, ...markupAttrs);
    return renderer(attrs);
}

const moo = require("moo");
const lexer = moo.compile({
    EOF: /<EOF>/, // Must match const in parsers (TODO: move both to another .js file)
    colons2xplus: /::+/,
    colon: /:/, // one colon
    any_but_colon: {match: /[^:]/, lineBreaks: true},
});
%}

@lexer lexer

all ->
    # Match plaintext.
    # We use left recursion to keep stack shallow.
    # Left recursion means that the first term of the right-hand-side
    # of the rule is the rule itself.
    # Ex.
    #               +--- first term is the rule itself.
    #              /
    #     all -> all %any_but_colon
    #      \   \
    #       \   +---- everything to the right is RHS
    #        \
    #         + production symbol (aka rule)
    #
    # By applying recursion, we can match the terminal %any_but_colon
    # at the beginning, in the middle, or at the end of any chunk of text
    # being lexed/parsed. I.e. we can match %any_but_colon anywhere.
    %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}
    | all %any_but_colon {% (d) => _trace(d, d=>d, "trace") %}

    # Match a single colon anywhere.
    # Use left recursion.
    | ":" {% (d) => _trace(d, d=>d, "trace") %}
    | all ":" {% (d) => _trace(d, d=>d, "trace") %}

    # Match a sequence of colons anywhere.
    # Use left recursion.
    | colons_etc {% (d) => _trace(d, d=>d, "trace") %}
    | all colons_etc {% (d) => _trace(d, d=>d, "trace") %}

colons_etc -> 
    %colons2xplus __ {% (d) => _trace(d, d=>null, "null") %}
    | %colons2xplus markup_def {% (d) => _trace(d, d=>d[1], "markup") %}

end -> %EOF

markup_def -> markup_kw "{" _ markup_attrs "}" {% (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def") %}

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}