const { pegParse, pegParse2 } = require("./peg_parsers.js");
const { nearleyParse, nearleyParseInner } = require("./nearley_parsers.js");

module.exports = { pegParse, pegParse2, nearleyParse, nearleyParseInner };