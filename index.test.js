const parsers = require("./index.js");
// const parse = parsers.pegParse;
const parse = parsers.nearleyParse;

const parseErrorRegex = /Parse error\.\n*/;

describe("parse plaintext", () => {
    test("no input", () => {
        res = parse("");
        expect(res).toEqual("");
    });
    test("grammar is not ambiguous ('pt', a 2-letter word would produce 2 results if grammar were ambiguous)", () => {
        res = parse("pt");
        expect(res).toEqual("pt");
    });
    test("plaintext", () => {
        res = parse("plaintext");
        expect(res).toEqual("plaintext");
    });
    test("plaintext:", () => {
        res = parse("plaintext:");
        expect(res).toEqual("plaintext:");
    });
    test(":plaintext", () => {
        res = parse(":plaintext");
        expect(res).toEqual(":plaintext");
    });
    test("plain:text", () => {
        res = parse("plain:text");
        expect(res).toEqual("plain:text");
    });
    test(":plaintext:", () => {
        res = parse(":plaintext:");
        expect(res).toEqual(":plaintext:");
    });
    test("plain:te:xt", () => {
        res = parse("plain:te:xt");
        expect(res).toEqual("plain:te:xt");
    });
    test("plain:te:xt<newline><newline>", () => {
        res = parse("plain:te:xt\n\n");
        expect(res).toEqual("plain:te:xt\n\n");
    });
});

describe("parse unknown markup ::ab (w/ and w/o attrs)", () => {
    test.failing("::ab", () => {
        res = parse("::ab");
        expect(res).toEqual("");
    });
    test("::ab\n", () => {
        res = parse("::ab\n");
        expect(res).toEqual("");
    });
    test("::ab.", () => {
        res = parse("::ab.");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::ab ", () => {
        res = parse("::ab ");
        expect(res).toEqual("");
    });

    test.failing("\n::ab", () => {
        res = parse("\n::ab");
        expect(res).toEqual("\n");
    });
    test.failing(".::ab", () => {
        res = parse(".::ab");
        expect(res).toEqual(".");
    });
    test.failing(" ::ab", () => {
        res = parse(" ::ab");
        expect(res).toEqual(" ");
    });

    test.failing(":::ab", () => {
        res = parse(":::ab");
        expect(res).toEqual("");
    });
    test(":::ab\n", () => {
        res = parse(":::ab\n");
        expect(res).toEqual("");
    });
    test(":::ab.", () => {
        res = parse(":::ab.");
        expect(res).toMatch(parseErrorRegex);
    });
    test(":::ab ", () => {
        res = parse(":::ab ");
        expect(res).toEqual("");
    });

    test("::ab{}", () => {
        res = parse("::ab{}");
        expect(res).toEqual("");
    });
    test("::ab{ }", () => {
        res = parse("::ab{ }");
        expect(res).toEqual("");
    });
    test("::ab{a='1'}", () => {
        res = parse("::ab{a='1'}");
        expect(res).toEqual("{\"a\":\"1\"}");
    });
    test("::ab{a='1' b='2'}", () => {
        res = parse("::ab{a='1' b='2'}");
        expect(res).toEqual("{\"a\":\"1\",\"b\":\"2\"}");
    });
    test(":::ab{}", () => {
        res = parse(":::ab{}");
        expect(res).toEqual("");
    });
    test("::::ab{}", () => {
        res = parse("::::ab{}");
        expect(res).toEqual("");
    });
    test(":::::ab{}", () => {
        res = parse(":::::ab{}");
        expect(res).toEqual("");
    });
    test("::ab{a='1' b='2'} == ::ab{b='2' a='1'}", () => {
        res0 = parse("::ab{a='1' b='2'}");
        expect(res0).toEqual("{\"a\":\"1\",\"b\":\"2\"}");
        res1 = parse("::ab{b='2' a='1'}");
        expect(res1).toEqual("{\"a\":\"1\",\"b\":\"2\"}");
    });
});

describe("return 'parse error' with invalid markup", () => {
    test("::invalid. is not terminated by \s", () => {
        res = parse("::invalid.");
        expect(res).toMatch(parseErrorRegex);
    });
    test.failing("::invalid{", () => {
        res = parse("::invalid{");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::invalid}", () => {
        res = parse("::invalid}");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::invalid{{", () => {
        res = parse("::invalid{{");
        expect(res).toMatch(parseErrorRegex);
    });
    test.failing("::invalid{a='}", () => {
        res = parse("::invalid{a='}");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::invalid{a}", () => {
        res = parse("::invalid{a}");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::invalid{=}", () => {
        res = parse("::invalid{=}");
        expect(res).toMatch(parseErrorRegex);
    });
});

describe("ignore ::+ when applicable (incomplete rules produce no results)", () => {
    let ctx = {};
    test.failing.each([
        ["a::", "a"],
        ["a::a", "a"],
        ["\n::", "\n"],

        ["a:::", "a"],
        ["a:::a", "a"],
        ["\n:::", "\n"],

        ["a::::", "a"],
        ["a::::a", "a"],
        ["\n::::", "\n"],

        ["a:::::", "a"],
        ["a:::::a", "a"],
        ["\n:::::", "\n"],
    ])("(%s)", (text, expected) => {
        res = parse(text, ctx);
        expect(res).toMatch(expected);
    });
});
    
describe("ignore ::+ when applicable", () => {
    let ctx = {};
    test.each([
        ["::", ""],
        [" ::", " "],
        [":: ", " "],
        [" :: ", "  "],
        // ["\n::", "\n"],
        ["::\n", "\n"],
        ["\n::\n", "\n\n"],
        [".::", "."],
        ["::.", parseErrorRegex],
        [".::.", parseErrorRegex],
        // ["a::", "a"],
        ["::a", ""],
        // ["a::a", "a"],

    ])("2x :: (%s)", (text, expected) => {
        res = parse(text, ctx);
        expect(res).toMatch(expected);
    });

    test.each([
        [":::", ""],
        [" :::", " "],
        ["::: ", " "],
        [" ::: ", "  "],
        // ["\n:::", "\n"],
        [":::\n", "\n"],
        ["\n:::\n", "\n\n"],
        [".:::", "."],
        [":::.", parseErrorRegex],
        [".:::.", parseErrorRegex],
        // ["a:::", "a"],
        [":::a", ""],
        // ["a:::a", "a"],

    ])("3x ::: (%s)", (text, expected) => {
        res = parse(text, ctx);
        expect(res).toMatch(expected);
    });

    test.each([
        ["::::", ""],
        [" ::::", " "],
        [":::: ", " "],
        [" :::: ", "  "],
        // ["\n::::", "\n"],
        ["::::\n", "\n"],
        ["\n::::\n", "\n\n"],
        [".::::", "."],
        ["::::.", parseErrorRegex],
        [".::::.", parseErrorRegex],
        // ["a::::", "a"],
        ["::::a", ""],
        // ["a::::a", "a"],

    ])("4x :::: (%s)", (text, expected) => {
        res = parse(text, ctx);
        expect(res).toMatch(expected);
    });

    test.each([
        [":::::", ""],
        [" :::::", " "],
        ["::::: ", " "],
        [" ::::: ", "  "],
        // ["\n:::::", "\n"],
        [":::::\n", "\n"],
        ["\n:::::\n", "\n\n"],
        [".:::::", "."],
        [":::::.", parseErrorRegex],
        [".:::::.", parseErrorRegex],
        // ["a:::::", "a"],
        [":::::a", ""],
        // ["a:::::a", "a"],

    ])("5x ::::: (%s)", (text, expected) => {
        res = parse(text, ctx);
        expect(res).toMatch(expected);
    });
});

describe("parse attribute-less markup (e.g. ::any )", () => {
    let ctx = {};
    test.failing("::row", () => {
        res = parse("::row", ctx);
        expect(res).toEqual("");
    });
    test.failing(":::::any", () => {
        res = parse(":::::any", ctx);
        expect(res).toEqual("");
    });
});

describe("parse ::row (w/ and w/o attrs)", () => {
    test.failing("::row", () => {
        res = parse("::row");
        expect(res).toEqual("");
    });
    test("::row{}", () => {
        res = parse("::row{}");
        expect(res).toEqual("");
    });
    test("::row{ }", () => {
        res = parse("::row{ }");
        expect(res).toEqual("");
    });
    test("::row{a='1'}", () => {
        res = parse("::row{a='1' b='2'}");
        expect(res).toEqual("");
    });
});

describe("parse ::quoted-text{}", () => {
    const template = ({quote, author}) => `\n> ${quote || ""}\n> \t - ${author || ""}\n`; // TODO: abstract out all specifics from the grammar.
    const reQuoteAuthor = /^.*Quote.*Author.*$/sgm;
    test("::quoted-text{}", () => {
        res = parse("::quoted-text{}");
        expect(res).toEqual("");
    });
    test("::quoted-text{ }", () => {
        res = parse("::quoted-text{ }");
        expect(res).toEqual("");
    });
    test("::quoted-text{author='Author' quote=\"Quote\"}", () => {
        res = parse("::quoted-text{author='Author' quote=\"Quote\"}");
        expect(res).toMatch(reQuoteAuthor);
        // Exact templated string match. This test is prone to break if the template changes.
        expect(res).toEqual(template({author: "Author", quote: "Quote"}));
    });
    test("::quoted-text{author='Hamlet'}", () => {
        res = parse("::quoted-text{author='Hamlet'}");
        expect(res).toEqual(template({author: "Hamlet"}));
    });
    test("::quoted-text{quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{quote='To be or not to be ...'}");
        expect(res).toEqual(template({quote: "To be or not to be ..."}));
    });
    test("::quoted-text{author='Hamlet' quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{author='Hamlet' quote='To be or not to be ...'}");
        expect(res).toEqual(template({author: "Hamlet", quote: "To be or not to be ..."}));
    });
    test("::quoted-text{unknown='unknown' author='Hamlet' quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{unknown='unknown' author='Hamlet' quote='To be or not to be ...'}");
        expect(res).toEqual(template({author: "Hamlet", quote: "To be or not to be ...", unknown: "???"}));
    });
});

const pegParse2 = parsers.pegParse2;

describe("parse2", () => {
    test("something", () => {
        res = pegParse2("something");
        expect(res.text).toEqual("something");
    });
    test("something something", () => {
        res = pegParse2("something something");
        expect(res.text).toEqual("something something");
    });
    test("something something something", () => {
        res = pegParse2("something something something");
        expect(res.text).toEqual("something something something");
    });
});