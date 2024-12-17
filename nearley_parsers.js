const nearley = require("nearley");
const grammar = require("./nearley_grammar.js");

const ALLOW_AMBIGUOUS_GRAMMAR = false;

function nearleyParseInner(text) {
    if (!text) return { text: "" };

    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: false });
    try {
        parser.feed(text);

        if (parser.results.length == 1) {
            return {
                // text: parser.results[0].flat(Infinity).join("") // TODO: PUT BACK
                text: parser.results[0]
            };
        }

        let logger = console.error;

        if (parser.results.length == 0) {
            error = "No results";
        } else {
            error = `Ambiguous grammar. Found ${parser.results.length} results`;
        }

        let res = { error };

        if (ALLOW_AMBIGUOUS_GRAMMAR) {
            logger = console.warn;
            let badResults = parser.results.slice(0, 2); // first 2.
            if (badResults) {
                // Flatten and compare. If they match, warn and return one.
                let flatten0 = badResults[0].flat(Infinity).join("");
                let flatten1 = badResults[1].flat(Infinity).join("");
                if (flatten0 == flatten1) {
                    console.warn("First two results matched when flattened. Unflattened look like this:")
                    console.warn(JSON.stringify(badResults, null, 2));

                    res.text = flatten0,
                        res.warning = error;
                    delete res.error;
                }
            }
        }

        logger(parser.reportErrorCommon("N/A", "N/A"));
        logger(error);

        return res;
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