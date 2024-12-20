const parsers = require("./index.js");
// const parse = parsers.pegParse;
const parse = parsers.nearleyParse;

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
    test("::ab", () => {
        res = parse("::ab");
        expect(res).toEqual("");
    });
    test("::ab ", () => {
        res = parse("::ab");
        expect(res).toEqual("");
    });
    test("::ab\n", () => {
        res = parse("::ab");
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
    let parseErrorRegex = /Parse error\.\n*/;
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

describe("ignore ::+", () => {
    let ctx = {};
    // TODO: Add tests with EOF (\n at the end) AND tests that make parser inject EOF)
    test(":: is allowed and gets skipped", () => {
        res = parse("::", ctx);
        expect(res).toEqual("");
    });
    test("::: is allowed and gets skipped", () => {
        res = parse(":::", ctx);
        expect(res).toEqual("");
    });
    test(":::: is allowed and gets skipped", () => {
        res = parse("::::", ctx);
        expect(res).toEqual("");
    });
    test("::::: is allowed and gets skipped", () => {
        res = parse(":::::", ctx);
        expect(res).toEqual("");
    });
});

describe("parse attribute-less markup (e.g. ::any )", () => {
    let ctx = {};
    test("::row", () => {
        res = parse("::row", ctx);
        expect(res).toEqual("");
    });
    test(":::::any", () => {
        res = parse(":::::any", ctx);
        expect(res).toEqual("");
    });
});

describe("parse ::row (w/ and w/o attrs)", () => {
    test("::row", () => {
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