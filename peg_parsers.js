parser = require("./grammar.js");
parser2 = require("./repeated_non_terminals.js");

function join_elems(elements) {
    // Handles string and TreeNode
    return elements.map((e) => e?.text === undefined ? e : e.text).join("");
}

let actions = {
    make_final(input, start, end, elements) {
        return join_elems(elements);
    },
    make_lines(input, start, end, elements) {
        return join_elems(elements);
    },
    make_plain(input, start, end, elements) {
        return join_elems(elements);
    },
    make_markup(input, start, end, elements) {
        return elements[0].textWithAttrs(elements[1].elements);
    },
    make_attr(input, start, end, elements) {
        let attr = {};
        let attr_name = elements[0].text;
        let attr_value = elements[1];
        attr[attr_name] = attr_value;
        return attr;
    },
    make_string(input, start, end, elements) {
        return elements[0].text;
    },
}

let types = {
    Row: {
        textWithAttrs(elements) {
            return "";
        },
    },
    QuotedText: {
        textWithAttrs(elements) {
            let author = "";
            let quote = "";
            for (element of elements) {
                author = element?.author || author;
                quote = element?.quote || quote;
            }
            return `${quote} - ${author}`;
        },
    }
}

function pegParse(text) {
    return parser.parse(text, {actions, types});
}

function pegParse2(text) {
    return parser2.parse(text);
}

module.exports = {pegParse, pegParse2}