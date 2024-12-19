const nearley = require("nearley");
const grammar = require("./nearley_grammar.js");

const ALLOW_AMBIGUOUS_GRAMMAR = false;
const FEED_EOF_IF_NEEDED = false;
const EOF = "<EOF>"; // Must match token in grammar

function _patch(res, patch) {
    return Object.assign(res, patch);
}

function nearleyParseInner(text) {

    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: false });
    let res = {parser};

    if (!text) return _patch(res, { text: "" });

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

        // Depending on the grammar, we might be stuck in a rule
        // waiting for more chars (e.g. missing closing block).
        // Given that neither the lexer nor the parser have support
        // for EOF, there is no way for neither to abort and error out
        // because all the input was consumed and nothing parsed.
        // Hence, push <EOF> to make them "crash."
        if (parser.results.length == 0 && FEED_EOF_IF_NEEDED) {
            parser.feed(EOF); // TODO: Try using grammar to get the %EOF token from Moo or const in another .js file @imported into grammar
            let eofWasFed = true;
            _patch(res, {eofWasFed});
        }
        
        if (parser.results.length == 1) {
            return _patch(res, {
                text: parser.results[0].flat(Infinity).join(""),
            });
        }

        let error;
        if (parser.results.length == 0) {
            error = "No results.";
        } else {
            error = `Ambiguous grammar. Found ${parser.results.length} results`;
            if (areAmbiguousResultsEqual(parser)) {
                if (ALLOW_AMBIGUOUS_GRAMMAR) {
                    let warning = error;
                    console.warn(warning);
                    return _patch(res, {
                        text: parser.results[0].flat(Infinity).join(""),
                        warning,
                    });
                }
            }
        }

        console.error(parser.reportErrorCommon("N/A", "N/A"));
        console.error(error);

        return _patch(res, { error });
    }
    catch (parseError) {
        console.error(parseError);
        return _patch(res, { error: `Parse error.\n${parseError}` });
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

function _eofTail(text) {
    // "plaintext<EOF>" formatted as "...ntext[<EOF>]"
    return `...${text.slice(-2*EOF.length, -EOF.length)}[${text.slice(-EOF.length)}]`
}

// function *_wrapText(text) {
//     yield " ";
//     yield text;
//     yield " ";
// }

function _wrapText(text) {
    return ` ${text} `;
}

function nearleyParse(text, ctx={}) {
    let res = nearleyParseInner(_wrapText(text));
    if (res.text) {
        res.text = res.text.trim();
        if (res.eofWasFed) {
            console.warn("<EOF> tail removed.", _eofTail(text));
            res.text = res.text.slice(-EOF.length);
        }
    }
    ctx.res = res;
    return res?.error || res.text;
}

module.exports = { nearleyParseInner, nearleyParse }