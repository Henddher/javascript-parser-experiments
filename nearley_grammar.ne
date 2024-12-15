@builtin "whitespace.ne"
@builtin "string.ne"

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
    | plaintext .