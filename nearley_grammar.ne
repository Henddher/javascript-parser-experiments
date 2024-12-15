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
%}

final -> line:*

line -> plaintext
    | markup_line

markup_line -> _ colons markup_def _
    | _ colons _

colons -> "::" ":":*

markup_def -> markup_kw "{" markup_attr:* "}" _ "\n"

markup_attr -> _ attr_name _ "=" _ string _

string -> dqstring | sqstring

markup_kw -> [a-zA-Z0-9-]:+

attr_name -> [a-zA-Z0-9]:+

plaintext -> [^:]
    | plaintext . {% (d) => _trace(d, d=>d[0].concat(d[1]), "plaintext .") %}