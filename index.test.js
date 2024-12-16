const parsers = require("./index.js");
// const parse = parsers.pegParse;
const parse = parsers.nearleyParse;

describe("parse", () => {
    test("dummy line", () => {
        res = parse("dummy line");
        expect(res).toEqual("dummy line");
    });
    test("a line\nanother line", () => {
        res = parse("a line\nanother line");
        expect(res).toEqual("a line\nanother line");
    });
    // test("a line\n\nanother line", () => {
    //     res = parse("a line\n\nanother line");
    //     expect(res).toEqual("a line\n\nanother line");
    // });
    // test(" a line \n \n another line \n", () => {
    //     res = parse(" a line \n \n another line \n");
    //     expect(res).toEqual("a line \n \n another line \n");
    // });
    test("::row{}", () => {
        res = parse("::row{}");
        expect(res).toEqual("");
    });
    test("::row{ }", () => {
        res = parse("::row{ }");
        expect(res).toEqual("");
    });
    test("::row{a='1' b='2'}", () => {
        res = parse("::row{a='1' b='2'}");
        expect(res).toEqual("");
    });
    // test("::row{} \n \n another line \n", () => {
    //     res = parse(" ::row{} \n \n another line \n");
    //     expect(res).toEqual(" \n \n another line \n");
    // });
    // test("::row{a='1'} \n \n another line \n", () => {
    //     res = parse(" ::row{a='1'} \n \n another line \n");
    //     expect(res).toEqual(" \n \n another line \n");
    // });
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