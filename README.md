# Parser Experiments with JavaScript

These experiements aim to **subjectively evaluate** different JavaScript Parser (with Lexer) libraries and
the complexity of creating grammars for each. 

## DISCLAIMER 

**These experiments do NOT, in any way or form, intend to offer any objective (or subjective) assessment of any
of the features and/or capabilities offered by any of the libraries selected.**

These experiements are just for my own sake and their sole intention is to help me write specific grammars
and parse sample documents.

## Document Syntax

The input, a plain text document (even markdown), containing special markup like 
`::markup-keyword{attr_0="attr 0 value", attr_1="attr 1 value" [, ...]}`
is meant to be rendered as plain text. The markup means to expand *semantically* the text.

Each experiment consists of using each library to generate a Parser capable of processing these documents.

## Parser Libraries Selected

The following libraries were *arbitrarely* selected from a quick internet search.

- [Canopy](https://canopy.jcoglan.com/)
- [Nearley](https://nearley.js.org/)

## Updating the Grammar

```shell
$ $EDITOR nearley_grammar.ne # edit
$ npm run compile-ne-grammar
$ npm test
```