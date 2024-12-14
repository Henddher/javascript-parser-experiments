parser = require("./grammar.js");
parser2 = require("./repeated_non_terminals.js");

let actions = {
    make_plain(input, start, end, elements) {
        return elements.map((e)=>e.text).join("");
    },
    make_markup(input, start, end, elements) {
        return elements.map((e)=>e.text).join("");
    },
    make_attr(input, start, end, elements) {
        let attr_name = elements[0].text;
        let attr_value = elements[1];
        return {attr_name: attr_value};
    },
    make_string(input, start, end, elements) {
        return elements[1].text;
    },
}

let types = {
    Void: {
        text() {
            return "";
        }
    },
    QuotedText: {
        text() {
            return this.text;
        }
    }
}

function parse(text) {
    return parser.parse(text, {actions, types});
}

function parse2(text) {
    return parser2.parse(text);
}

module.exports = {parse, parse2};