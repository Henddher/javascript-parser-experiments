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
        // parser.feed(` ${text} `);

        // Depending on the grammar, we might be stuck in a rule
        // waiting for more chars (e.g. missing closing block).
        // Given that neither the lexer nor the parser have support
        // for EOF, there is no way for neither to abort and error out
        // because all the input was consumed and nothing parsed.
        // Hence, push <EOF> to make them "crash."
        if (parser.results.length == 0 && FEED_EOF) {
            parser.feed(EOF); // TODO: Try using grammar to get the %EOF token from Moo or const in another .js file @imported into grammar
        }
        
        if (parser.results.length == 1) {
            return {
                text: parser.results[0].flat(Infinity).join("")
            }
        }

        let error;
        if (parser.results.length == 0) {
            error = "No results.";
        } else {
            error = `Ambiguous grammar. Found ${parser.results.length} results`;
            if (areAmbiguousResultsEqual(parser)) {
                let warning = error;
                logger.warn(warning);
                if (ALLOW_AMBIGUOUS_GRAMMAR) {
                    return {
                        text: parser.results[0].flat(Infinity).join(""),
                        warning,
                        parser
                    }
                }
            }
        }

        console.error(parser.reportErrorCommon("N/A", "N/A"));
        console.error(error);

        return { error, parser };
    }
    catch (parseError) {
        console.error(parseError);
        return { error: `Parse error.\n${parseError}` };
    }
}

function areAmbiguousResultsEqual(parser) {
    let badResults = parser.results.slice(0, 2); // first 2.
    if (badResults) {
        // Flatten and compare. If they match, warn and return one.
        let flatten0 = badResults[0].flat(Infinity).join("");
        let flatten1 = badResults[1].flat(Infinity).join("");
        console.warn("First two results matched when flattened.");
        return flatten0 == flatten1;
    }
    return false;
}

function nearleyParse(text) {
    res = nearleyParseInner(text);
    return res?.error || (FEED_EOF ? res.text.slice(0, -EOF.length) : res.text);
}

module.exports = { nearleyParseInner, nearleyParse }