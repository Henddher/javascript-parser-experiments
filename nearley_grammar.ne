@builtin "whitespace.ne"
@builtin "string.ne"

@{%
function _trace(d, callback, tag="") {
    console.log(`<<<< ${tag}`);
    console.log(JSON.stringify(d, null, 2));
    let res = callback(d);
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

const _s = (text) => text || "";

const MARKUP_RENDERERS = {
    "quoted-text": (attrs) => {
        if (!attrs?.quote && !attrs?.author) {
            return "";
        }
        return `${_s(attrs?.quote)} - by ${_s(attrs?.author)}`;
    },
    "row": noopRenderer,
}

function renderMarkup(markupKw, markupAttrs) {
    let renderer = MARKUP_RENDERERS[markupKw] || JSON.stringify;
    let attrs = Object.assign({}, ...markupAttrs);
    return renderer(attrs);
}
%}

# all -> text all # ❌ (no results)
# text -> [^:]

# all -> text all # ❌ (no results)
# text -> [^:]:+
#     | null

# all -> text all # ❌
#     | null
# text -> [^:]:+

# all -> text all # ❌ (no results)
# text -> [^:]:+

# all -> text:* # ❌
# text -> [^:]:+

# all -> text # ✅
# text -> [^:]:+

# final -> line

line -> plaintext {% (d) => _trace(d, d=>d, "line plainline") %}
    | markup_line {% (d) => _trace(d, d=>d, "line markup_line") %}
    | plaintext ":" plaintext {% (d) => _trace(d, d=>[d.join("")], "line plainline : plainline") %}
    # | ":" plaintext {% (d) => _trace(d, d=>[d[0].concat(d[1])], "line : plainline") %}
    # | plaintext ":" {% (d) => _trace(d, d=>[d[0].concat(d[1])], "line plainline :") %}

markup_line -> colons markup_def {% (d) => _trace(d, d=>d[1], "markup_line") %}

colons -> "::" ":":*

markup_def -> markup_kw "{" _ markup_attrs "}" {% (d) => _trace(d, d=>renderMarkup(d[0], d[3]), "markup_def") %}

markup_attrs -> markup_attr:* {% (d) => _trace(d, id, "markup_attrs") %}

markup_attr -> attr_name _ "=" _ string _ {% (d) => _trace(d, d=>newMarkupAttribute(d[0], d[4]), "markup_attr") %}

string -> dqstring | sqstring {% id %}

markup_kw -> [a-zA-Z0-9-]:+ {% (d) => _trace(d, d=>idjoiner(d), "markup_kw") %}

attr_name -> [a-zA-Z0-9]:+ {% (d) => _trace(d, d=>idjoiner(d), "attr_name") %}

plaintext -> [^:]:+ {% (d) => _trace(d, d=>idjoiner(d), "plaintext") %}