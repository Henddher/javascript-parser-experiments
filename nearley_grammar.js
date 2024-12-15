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
    {"name": "final$ebnf$1", "symbols": []},
    {"name": "final$ebnf$1", "symbols": ["final$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "final", "symbols": ["final$ebnf$1"]},
    {"name": "line", "symbols": ["plaintext"]},
    {"name": "line", "symbols": ["markup_line"]},
    {"name": "markup_line", "symbols": ["_", "colons", "markup_def", "_"]},
    {"name": "markup_line", "symbols": ["_", "colons", "_"]},
    {"name": "colons$string$1", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "colons$ebnf$1", "symbols": []},
    {"name": "colons$ebnf$1", "symbols": ["colons$ebnf$1", {"literal":":"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "colons", "symbols": ["colons$string$1", "colons$ebnf$1"]},
    {"name": "markup_def$ebnf$1", "symbols": []},
    {"name": "markup_def$ebnf$1", "symbols": ["markup_def$ebnf$1", "markup_attr"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_def", "symbols": ["markup_kw", {"literal":"{"}, "markup_def$ebnf$1", {"literal":"}"}, "_", {"literal":"\n"}]},
    {"name": "markup_attr", "symbols": ["_", "attr_name", "_", {"literal":"="}, "_", "string", "_"]},
    {"name": "string", "symbols": ["dqstring"]},
    {"name": "string", "symbols": ["sqstring"]},
    {"name": "markup_kw$ebnf$1", "symbols": [/[a-zA-Z0-9-]/]},
    {"name": "markup_kw$ebnf$1", "symbols": ["markup_kw$ebnf$1", /[a-zA-Z0-9-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "markup_kw", "symbols": ["markup_kw$ebnf$1"]},
    {"name": "attr_name$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "attr_name$ebnf$1", "symbols": ["attr_name$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr_name", "symbols": ["attr_name$ebnf$1"]},
    {"name": "plaintext", "symbols": [/[^:]/]},
    {"name": "plaintext", "symbols": ["plaintext", /./], "postprocess": (d) => _trace(d, d=>d[0].concat(d[1]), "plaintext .")}
]
  , ParserStart: "final"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
