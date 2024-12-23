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
    // NOTE: For now, a tuple suffices. Later, when the result
    // of parsing becomes an AST, a true instance would make
    // more sence.
    return [attrName, attrValue];
}

const noopRenderer = (attrs) => "";
const jsonRenderer = (attrs) => {
    if (!attrs.length) {
        // Although [] is a valid JSON, we don't want it.
        return "";
    }
    // Force output to be deterministic.
    return JSON.stringify(
        Object.fromEntries(attrs.sort())
    );
};

const _str = (text) => text || "";

const MARKUP_RENDERERS = {
    "quoted-text": (attrs) => {
        let objAttrs = Object.fromEntries(attrs);
        // TODO: should a quoted-text missing both be allowed? Maybe no! IDEA: add opts.strict to validate docs
        if (!objAttrs?.quote && !objAttrs?.author) {
            return "";
        }
        // Template:
        // <NEWLINE>
        // > quote <NEWLINE>
        // > <TAB> - author <NEWLINE>
        // <NEWLINE>
        return "\n" + `> ${_str(objAttrs?.quote)}` + "\n" + `> \t - ${_str(objAttrs?.author)}` + "\n";
    },
    "row": noopRenderer,
}

function renderMarkup(markupKw, markupAttrs) {
    let renderer = MARKUP_RENDERERS[markupKw] || jsonRenderer;
    return renderer(markupAttrs);
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
    %any_but_colon {% (d) => _trace(d, id, "trace") %}
    | all %any_but_colon {% (d) => _trace(d, d=>d[0] + d[1], "trace") %}

    # Match a single colon anywhere.
    # Use left recursion.
    | ":" {% (d) => _trace(d, id, "trace") %}
    | all ":" {% (d) => _trace(d, d=>d[0] + d[1], "trace") %}

    # Match a sequence of colons anywhere.
    # Use left recursion.
    | colons_etc {% (d) => _trace(d, id, "trace") %}
    | all colons_etc {% (d) => _trace(d, d=>d[0] + d[1], "trace") %}

colons_etc -> 
    %colons2xplus markup_def {% (d) => _trace(d, d=>d[1] || "", "markup") %}

end -> %EOF {% (d) => _trace(d, d=>d, "EOF") %}

markup_def ->
    markup_kw markup_body {% (d) => _trace(d, d=>renderMarkup(d[0], d[1]), "markup_def") %}
    | markup_kw markup_end {% (d) => _trace(d, d=>renderMarkup(d[0], []), "markup_def") %}
    | markup_end {% (d) => _trace(d, d=>"", "markup_def") %}

markup_body -> "{" _ markup_attrs "}" {% (d) => _trace(d, d=>d[2], "markup_body") %}

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string ->
    dqstring {% id %}
    | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>d[0].join(""), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>d[0].join(""), "attr_name") %}

markup_end -> [ \n]