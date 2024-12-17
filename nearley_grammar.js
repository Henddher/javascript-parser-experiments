// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

function _trace(d, callback, tag="") {
    console.log(`<<<< ${tag}`);
    console.log(JSON.stringify(d, null, 2));
    let res = callback(d);
    console.log(">>>>");
    console.log(JSON.stringify(res, null, 2));
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
}

function renderMarkup(markupKw, markupAttrs) {
    let renderer = MARKUP_RENDERERS[markupKw] || noopRenderer;
    let attrs = Object.assign({}, ...markupAttrs);
    return renderer(attrs);
}
var grammar = {
    Lexer: undefined,
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
    {"name": "line", "symbols": ["plaintext"], "postprocess": (d) => _trace(d, d=>d, "line plainline")},
    {"name": "line", "symbols": ["markup_line"], "postprocess": (d) => _trace(d, d=>d, "line markup_line")},
    {"name": "line", "symbols": [{"literal":":"}, "plaintext"], "postprocess": (d) => _trace(d, d=>[d[0].concat(d[1])], "line : plainline")},
    {"name": "line", "symbols": ["plaintext", {"literal":":"}], "postprocess": (d) => _trace(d, d=>[d[0].concat(d[1])], "line plainline :")},
    {"name": "markup_line", "symbols": ["colons", "markup_def"], "postprocess": (d) => _trace(d, d=>d[1], "markup_line")},
    {"name": "colons$string$1", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "colons$ebnf$1", "symbols": []},
    {"name": "colons$ebnf$1", "symbols": ["colons$ebnf$1", {"literal":":"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "colons", "symbols": ["colons$string$1", "colons$ebnf$1"]},
    {"name": "markup_def", "symbols": ["markup_kw", {"literal":"{"}, "_", "markup_attrs", {"literal":"}"}], "postprocess": (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def")},
    {"name": "markup_attrs$ebnf$1", "symbols": []},
    {"name": "markup_attrs$ebnf$1", "symbols": ["markup_attrs$ebnf$1", "markup_attr"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_attrs", "symbols": ["markup_attrs$ebnf$1"], "postprocess": (d) => _trace(d, id, "markup_attrs")},
    {"name": "markup_attr", "symbols": ["attr_name", "_", {"literal":"="}, "_", "string", "_"], "postprocess": (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr")},
    {"name": "string", "symbols": ["dqstring"]},
    {"name": "string", "symbols": ["sqstring"], "postprocess": id},
    {"name": "markup_kw$ebnf$1", "symbols": [/[a-zA-Z0-9-]/]},
    {"name": "markup_kw$ebnf$1", "symbols": ["markup_kw$ebnf$1", /[a-zA-Z0-9-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_kw", "symbols": ["markup_kw$ebnf$1"], "postprocess": (d) => _trace(d, d=>idjoiner(d), "markup_kw")},
    {"name": "attr_name$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "attr_name$ebnf$1", "symbols": ["attr_name$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr_name", "symbols": ["attr_name$ebnf$1"], "postprocess": (d) => _trace(d, d=>idjoiner(d), "attr_name")},
    {"name": "plaintext$ebnf$1", "symbols": [/[^:]/]},
    {"name": "plaintext$ebnf$1", "symbols": ["plaintext$ebnf$1", /[^:]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "plaintext", "symbols": ["plaintext$ebnf$1"], "postprocess": (d) => _trace(d, d=>idjoiner(d), "plaintext")}
]
  , ParserStart: "line"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
