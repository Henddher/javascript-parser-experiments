const parsers = require("./index.js");
// const parse = parsers.pegParse;
const parse = parsers.nearleyParse;

describe("parse plaintext", () => {
    test("<EOF>", () => {
        res = parse("");
        expect(res).toEqual("");
    });
    test("grammar is not ambiguous ('ok', a 2-letter word would produce 2 results if grammar were ambiguous)", () => {
        res = parse("ok");
        expect(res).toEqual("ok");
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
    test("\n::quoted-text{quote='To be or not to be ...'}", () => {
        res = parse("\n::quoted-text{quote='To be or not to be ...'}");
        expect(res).toEqual("\nTo be or not to be ... - by ");
    });
    test("  ::quoted-text{author='Hamlet' quote='To be or not to be ...'} text", () => {
        res = parse("  ::quoted-text{author='Hamlet' quote='To be or not to be ...'} text");
        expect(res).toEqual("  To be or not to be ... - by Hamlet text");
    });
    test("::quoted-text <space> {} is not allowed", () => {
        res = parse("::quoted-text {}");
        expect(res).toEqual("Parse error");
    });
    test(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n", () => {
        res = parse(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n");
        expect(res).toEqual(" To be or not to be ... - by Hamlet \n \n another line \n");
    });
    // test("a line\n ::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n", () => {
    //     res = parse("a line\n ::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n");
    //     expect(res).toEqual("To be or not to be ... That is the question. \n \n another line \n");
    // });
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