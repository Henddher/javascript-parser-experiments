const nearley = require("nearley");
const grammar = require("./nearley_grammar.js");

function nearleyParseInner(text) {
    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
        let error = undefined;
        let res = parser.feed(text);
        if (res.results.length == 1) {
            return { text: res.results[0] };
        }
        if (res.results.length == 0) {
            error = "No results";
        } else {
            error = "Ambiguous grammar";
        }
        console.error(error)
        return { error };
    }
    catch (parseError) {
        console.error(parseError);
        return { error: "Parse error" };
    }
}

function nearleyParse(text) {
    res = nearleyParseInner(text);
    return res?.text?.length >= 0 ? res?.text : res.error;
}

module.exports = { nearleyParseInner, nearleyParse }