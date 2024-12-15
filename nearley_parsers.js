const nearley = require("nearley");
const grammar = require("./nearley_grammar.js");

function nearleyParseInner(text) {
    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true });
    try {
        parser.feed(text);

        if (parser.results.length == 1) {
            return { text: parser.results[0] };
        }

        let error;
        let badResults = [];
        if (parser.results.length == 0) {
            error = "No results";
        } else {
            error = `Ambiguous grammar. Found ${parser.results.length} results`;
            badResults = parser.results.slice(0, 2); // first 2.
            // TODO: Careful with the following, flatten0 looks like 't,e,x,t'
            // Flatten and compare. If they match, warn and return one.
            let flatten0 = badResults[0].flat(Infinity);
            let flatten1 = badResults[1].flat(Infinity);
            if (flatten0.join() == flatten1.join()) {
                console.warn(error);
                console.log(flatten0);
                return { text: flatten0.join(""), warning: error };
            }
        }
        console.error(error);
        console.warn(JSON.stringify(badResults, null, 2));
        console.log(parser.table);
        return { error };
    }
    catch (parseError) {
        console.error(parseError);
        return { error: "Parse error" };
    }
}

function nearleyParse(text) {
    res = nearleyParseInner(text);
    return res?.error || res.text;
}

module.exports = { nearleyParseInner, nearleyParse }