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
    test("plain:te:xt\n\n", () => {
        res = parse("plain:te:xt\n\n");
        expect(res).toEqual("plain:te:xt\n\n");
    });
});

describe("parse unknown markup ::unknown{}", () => {
    test("::unknown{}", () => {
        res = parse("::unknown{}");
        expect(res).toEqual("{}");
    });
    test("::unknown{ }", () => {
        res = parse("::unknown{ }");
        expect(res).toEqual("{}");
    });
    test("::unknown{a='1'}", () => {
        res = parse("::unknown{a='1'}");
        expect(res).toEqual("{\"a\":\"1\"}");
    });
    test("::unknown{a='1', b='2'}", () => {
        res = parse("::unknown{a='1' b='2'}");
        expect(res).toEqual("{\"a\":\"1\",\"b\":\"2\"}");
    });
    test(":::unknown{}", () => {
        res = parse(":::unknown{}");
        expect(res).toEqual("{}");
    });
    test("::::unknown{}", () => {
        res = parse("::::unknown{}");
        expect(res).toEqual("{}");
    });
    test(":::::unknown{}", () => {
        res = parse(":::::unknown{}");
        expect(res).toEqual("{}");
    });
});

describe("return 'parse error' with invalid markup", () => {
    let parseErrorRegex = /Parse error\.\n*/;
    test("::invalid <space> {} is not allowed", () => {
        res = parse("::invalid {}");
        expect(res).toMatch(parseErrorRegex);
    });
    test("::invalid{", () => {
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
    test("::invalid{a='}", () => {
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

describe("parse ::row{}", () => {
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
    test("::quoted-text{}", () => {
        res = parse("::quoted-text{}");
        expect(res).toEqual("");
    });
    test("::quoted-text{ }", () => {
        res = parse("::quoted-text{ }");
        expect(res).toEqual("");
    });
    test("::quoted-text{author='Hamlet'}", () => {
        res = parse("::quoted-text{author='Hamlet'}");
        expect(res).toEqual(" - by Hamlet");
    });
    test("::quoted-text{quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{quote='To be or not to be ...'}");
        expect(res).toEqual("To be or not to be ... - by ");
    });
    test("::quoted-text{author='Hamlet' quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{author='Hamlet' quote='To be or not to be ...'}");
        expect(res).toEqual("To be or not to be ... - by Hamlet");
    });
    test("::quoted-text{unknown='unknown' author='Hamlet' quote='To be or not to be ...'}", () => {
        res = parse("::quoted-text{unknown='unknown' author='Hamlet' quote='To be or not to be ...'}");
        expect(res).toEqual("To be or not to be ... - by Hamlet");
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