@builtin "whitespace.ne"
@builtin "string.ne"

@{%
function _trace(d, callback, tag="") {
    console.log(`<<<< ${tag}`);
    console.log(JSON.stringify(d, null, 2));
    res = callback(d);
    console.log(">>>>");
    console.log(JSON.stringify(res, null, 2));
    return res;
}

function newMarkupAttribute(attrName, attrValue) {
    let attr = {};
    attr[attrName] = attrValue;
    return attr;
}

function idjoiner(d) {
    return id(d).join("");
}

const noopRenderer = (_attrs) => "";

const MARKUP_RENDERERS = {
    "quoted-text": (attrs) => {
        return `${attrs?.quote} - by ${attrs?.author}`;
    },
}

function renderMarkup(markupKw, markupAttrs) {
    let renderer = MARKUP_RENDERERS[markupKw] || noopRenderer;
    let attrs = Object.assign({}, ...markupAttrs);
    return renderer(attrs);
}
%}

final -> line:*

line -> plaintext {% (d) => _trace(d, d=>d[0].flat(Infinity), "line plainline") %}
    | markup_line
    # | colons {% (d) => _trace(d, d=>null, "line colons") %}

markup_line -> _ colons markup_def _ {% (d) => _trace(d, d=>d[2], "markup_line") %}

colons -> "::" ":":*

markup_def -> markup_kw "{" markup_attrs "}" _ "\n" {% (d) => _trace(d, d=>renderMarkup(d[0], d[2]), "markup_def") %}

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> _ attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[1], d[5]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}

plaintext -> [^:]:+ {% (d) => _trace(d, d=>idjoiner(d), "plaintext") %}