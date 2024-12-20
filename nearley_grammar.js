// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "all", "symbols": [(lexer.has("any_but_colon") ? {type: "any_but_colon"} : any_but_colon)], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "all", "symbols": ["all", (lexer.has("any_but_colon") ? {type: "any_but_colon"} : any_but_colon)], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "all", "symbols": [{"literal":":"}], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "all", "symbols": ["all", {"literal":":"}], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "all", "symbols": ["colons_etc"], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "all", "symbols": ["all", "colons_etc"], "postprocess": (d) => _trace(d, d=>d, "trace")},
    {"name": "colons_etc", "symbols": [(lexer.has("colons2xplus") ? {type: "colons2xplus"} : colons2xplus), "__"], "postprocess": (d) => _trace(d, d=>null, "null")},
    {"name": "colons_etc", "symbols": [(lexer.has("colons2xplus") ? {type: "colons2xplus"} : colons2xplus), "markup_def"], "postprocess": (d) => _trace(d, d=>d[1], "markup")},
    {"name": "end", "symbols": [(lexer.has("EOF") ? {type: "EOF"} : EOF)]},
    {"name": "markup_def", "symbols": ["markup_kw", "markup_body"], "postprocess": (d) => _trace(d, d=>renderMarkup(d[0], d[1]), "markup_def")},
    {"name": "markup_body", "symbols": [{"literal":"{"}, "_", "markup_attrs", {"literal":"}"}], "postprocess": (d) => _trace(d, d=>d[2], "markup_body")},
    {"name": "markup_attrs$ebnf$1", "symbols": []},
    {"name": "markup_attrs$ebnf$1", "symbols": ["markup_attrs$ebnf$1", "markup_attr"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_attrs", "symbols": ["markup_attrs$ebnf$1"], "postprocess": (d) => _trace(d, id, "markup_attrs")},
    {"name": "markup_attr", "symbols": ["attr_name", "_", {"literal":"="}, "_", "string", "_"], "postprocess": (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr")},
    {"name": "string", "symbols": ["dqstring"], "postprocess": id},
    {"name": "string", "symbols": ["sqstring"], "postprocess": id},
    {"name": "markup_kw$ebnf$1", "symbols": [/[a-zA-Z0-9-]/]},
    {"name": "markup_kw$ebnf$1", "symbols": ["markup_kw$ebnf$1", /[a-zA-Z0-9-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_kw", "symbols": ["markup_kw$ebnf$1"], "postprocess": (d) => _trace(d, d=>idjoiner(d), "markup_kw")},
    {"name": "attr_name$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "attr_name$ebnf$1", "symbols": ["attr_name$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr_name", "symbols": ["attr_name$ebnf$1"], "postprocess": (d) => _trace(d, d=>idjoiner(d), "attr_name")}
]
  , ParserStart: "all"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
