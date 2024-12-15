const {parse, parse2} = require("./index.js");

test("dummy line", () => {
    res = parse("dummy line");
    expect(res).toEqual("dummy line");
});
test("a line\nanother line", () => {
    res = parse("a line\nanother line");
    expect(res).toEqual("a line\nanother line");
});
test("a line\n\nanother line", () => {
    res = parse("a line\n\nanother line");
    expect(res).toEqual("a line\n\nanother line");
});
test(" a line \n \n another line \n", () => {
    res = parse(" a line \n \n another line \n");
    expect(res).toEqual("a line \n \n another line \n");
});
test("::row{} \n \n another line \n", () => {
    res = parse(" ::row{} \n \n another line \n");
    expect(res).toEqual(" \n \n another line \n");
});
test("::row{a='1'} \n \n another line \n", () => {
    res = parse(" ::row{a='1'} \n \n another line \n");
    expect(res).toEqual(" \n \n another line \n");
});
test(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n", () => {
    res = parse(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n");
    expect(res).toEqual("To be or not to be ... - Hamlet \n \n another line \n");
});
test("::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n", () => {
    res = parse("a line\n ::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n");
    expect(res).toEqual("To be or not to be ... That is the question. \n \n another line \n");
});

test("", () => {
    res = parse2("something");
    expect(res.text).toEqual("something");
});
test("", () => {
    res = parse2("something something");
    expect(res.text).toEqual("something something");
});
test("", () => {
    res = parse2("something something something");
    expect(res.text).toEqual("something something something");
});