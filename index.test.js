const {pegParse, pegParse2} = require("./index.js");

test("dummy line", () => {
    res = pegParse("dummy line");
    expect(res).toEqual("dummy line");
});
test("a line\nanother line", () => {
    res = pegParse("a line\nanother line");
    expect(res).toEqual("a line\nanother line");
});
test("a line\n\nanother line", () => {
    res = pegParse("a line\n\nanother line");
    expect(res).toEqual("a line\n\nanother line");
});
test(" a line \n \n another line \n", () => {
    res = pegParse(" a line \n \n another line \n");
    expect(res).toEqual("a line \n \n another line \n");
});
test("::row{} \n \n another line \n", () => {
    res = pegParse(" ::row{} \n \n another line \n");
    expect(res).toEqual(" \n \n another line \n");
});
test("::row{a='1'} \n \n another line \n", () => {
    res = pegParse(" ::row{a='1'} \n \n another line \n");
    expect(res).toEqual(" \n \n another line \n");
});
test(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n", () => {
    res = pegParse(" ::quoted-text{author='Hamlet'  quote='To be or not to be ...'} \n \n another line \n");
    expect(res).toEqual("To be or not to be ... - Hamlet \n \n another line \n");
});
// test("::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n", () => {
//     res = pegParse("a line\n ::quoted-text{quote='To be or not to be ... That is the question.'} \n \n another line \n");
//     expect(res).toEqual("To be or not to be ... That is the question. \n \n another line \n");
// });

test("", () => {
    res = pegParse2("something");
    expect(res.text).toEqual("something");
});
test("", () => {
    res = pegParse2("something something");
    expect(res.text).toEqual("something something");
});
test("", () => {
    res = pegParse2("something something something");
    expect(res.text).toEqual("something something something");
});