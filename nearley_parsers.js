const nearley = require("nearley");
const grammar = require("./nearley_grammar.js");

const ALLOW_AMBIGUOUS_GRAMMAR = false;
const FEED_EOF = false;
const EOF = "<EOF>";

function nearleyParseInner(text) {
    if (!text) return { text: "" };

    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: false });
    try {

        // TODO: Revisit after nearly adds EOF.
        // Hackish solution: Append *special* marker to signal EOF.
        // That will tell the `lexer` that there's nothing else to consume afterwords.
        // `parser.finish()` does NOT fail when parser "thinks" it can
        // still consume more input. Although this might be due to bad grammar.
        // Without the EOF hack, `parser.results.length == 0`.
        // See:
        // https://github.com/kach/nearley/issues/305
        // https://github.com/kach/nearley/issues/306
        // https://github.com/search?q=repo%3Akach%2Fnearley+EOF&type=issues
        //
        // Another option is to catch the exception from `parser.results[0]`
        // and re-raise as EOF like it was done here:
        // https://github.com/penrose/penrose/pull/510/files
        parser.feed(text);

        // if (parser.results.length == 1) {
        //     return {
        //         text: parser.results[0].flat(Infinity).join("")
        //     };
        // }

        let logger = console.error;

        let attempts = 2;
        while (attempts > 0) {
            if (parser.results.length == 0) {
                --attempts;
                if (FEED_EOF) {
                    parser.feed(EOF); // TODO: Try using grammar to get the %EOF token from Moo or const in another .js file @imported into grammar
                }
                error = "No results";
            } else if (parser.results.length == 1) { // TODO: Remove this block when EOF is addressed
                return {
                    text: parser.results[0].flat(Infinity).join("").trim()
                };
            } else {
                error = `Ambiguous grammar. Found ${parser.results.length} results`;
            }
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
    return res?.error || (FEED_EOF ? res.text.slice(0, -EOF.length) : res.text);
}

module.exports = { nearleyParseInner, nearleyParse }