/**
 * This file was generated from canopy_grammar.peg
 * See https://canopy.jcoglan.com/ for documentation
 */

(function () {
  'use strict';

  function TreeNode (text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements;
  }

  TreeNode.prototype.forEach = function (block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    TreeNode.prototype[Symbol.iterator] = function () {
      return this.elements[Symbol.iterator]();
    };
  }

  var TreeNode1 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['line'] = elements[0];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['lines'] = elements[0];
  };
  inherit(TreeNode2, TreeNode);

  var TreeNode3 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['markup_id'] = elements[0];
  };
  inherit(TreeNode3, TreeNode);

  var TreeNode4 = function (text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['attr_name'] = elements[0];
    this['string'] = elements[1];
  };
  inherit(TreeNode4, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_final () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._final = this._cache._final || {};
      var cached = this._cache._final[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      address0 = this._read_lines();
      this._cache._final[index0] = [address0, this._offset];
      return address0;
    },

    _read_lines () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._lines = this._cache._lines || {};
      var cached = this._cache._lines[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read_line();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset, elements1 = [], address3 = null;
        while (true) {
          var index3 = this._offset, elements2 = new Array(1);
          var address4 = FAILURE;
          address4 = this._read__();
          if (address4 !== FAILURE) {
            var address5 = FAILURE;
            var index4 = this._offset, elements3 = [], address6 = null;
            while (true) {
              address6 = this._read__newline();
              if (address6 !== FAILURE) {
                elements3.push(address6);
              } else {
                break;
              }
            }
            if (elements3.length >= 1) {
              address5 = new TreeNode(this._input.substring(index4, this._offset), index4, elements3);
              this._offset = this._offset;
            } else {
              address5 = FAILURE;
            }
            if (address5 !== FAILURE) {
              var address7 = FAILURE;
              address7 = this._read_lines();
              if (address7 !== FAILURE) {
                elements2[0] = address7;
              } else {
                elements2 = null;
                this._offset = index3;
              }
            } else {
              elements2 = null;
              this._offset = index3;
            }
          } else {
            elements2 = null;
            this._offset = index3;
          }
          if (elements2 === null) {
            address3 = FAILURE;
          } else {
            address3 = new TreeNode2(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
          } else {
            break;
          }
        }
        if (elements1.length >= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_lines(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._lines[index0] = [address0, this._offset];
      return address0;
    },

    _read_line () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._line = this._cache._line || {};
      var cached = this._cache._line[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_markup();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_plain();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._line[index0] = [address0, this._offset];
      return address0;
    },

    _read_plain () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._plain = this._cache._plain || {};
      var cached = this._cache._plain[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read__();
      if (address1 !== FAILURE) {
        var address2 = FAILURE;
        var index2 = this._offset;
        address2 = this._read_colon2x();
        this._offset = index2;
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset, []);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[0] = address2;
          var address3 = FAILURE;
          var index3 = this._offset, elements1 = [], address4 = null;
          while (true) {
            if (this._offset < this._inputSize) {
              address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
              this._offset = this._offset + 1;
            } else {
              address4 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push(['Lines::plain', '<any char>']);
              }
            }
            if (address4 !== FAILURE) {
              elements1.push(address4);
            } else {
              break;
            }
          }
          if (elements1.length >= 1) {
            address3 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[1] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_plain(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._plain[index0] = [address0, this._offset];
      return address0;
    },

    _read_markup () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._markup = this._cache._markup || {};
      var cached = this._cache._markup[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read__();
      if (address1 !== FAILURE) {
        var address2 = FAILURE;
        address2 = this._read_colon2x();
        if (address2 !== FAILURE) {
          var address3 = FAILURE;
          address3 = this._read_markup_id();
          if (address3 !== FAILURE) {
            elements0[0] = address3;
            var address4 = FAILURE;
            var chunk0 = null, max0 = this._offset + 1;
            if (max0 <= this._inputSize) {
              chunk0 = this._input.substring(this._offset, max0);
            }
            if (chunk0 === '{') {
              address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
              this._offset = this._offset + 1;
            } else {
              address4 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push(['Lines::markup', '"{"']);
              }
            }
            if (address4 !== FAILURE) {
              var address5 = FAILURE;
              var index2 = this._offset, elements1 = [], address6 = null;
              while (true) {
                address6 = this._read_markup_attr();
                if (address6 !== FAILURE) {
                  elements1.push(address6);
                } else {
                  break;
                }
              }
              if (elements1.length >= 0) {
                address5 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
                this._offset = this._offset;
              } else {
                address5 = FAILURE;
              }
              if (address5 !== FAILURE) {
                elements0[1] = address5;
                var address7 = FAILURE;
                var chunk1 = null, max1 = this._offset + 1;
                if (max1 <= this._inputSize) {
                  chunk1 = this._input.substring(this._offset, max1);
                }
                if (chunk1 === '}') {
                  address7 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
                  this._offset = this._offset + 1;
                } else {
                  address7 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push(['Lines::markup', '"}"']);
                  }
                }
                if (address7 !== FAILURE) {
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_markup(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._markup[index0] = [address0, this._offset];
      return address0;
    },

    _read_markup_id () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._markup_id = this._cache._markup_id || {};
      var cached = this._cache._markup_id[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_row();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_quoted_text();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._markup_id[index0] = [address0, this._offset];
      return address0;
    },

    _read_row () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._row = this._cache._row || {};
      var cached = this._cache._row[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 3;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === 'row') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset, []);
        this._offset = this._offset + 3;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::row', '"row"']);
        }
      }
      if (address0 !== FAILURE) {
        Object.assign(address0, this._types.Row);
      }
      this._cache._row[index0] = [address0, this._offset];
      return address0;
    },

    _read_quoted_text () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._quoted_text = this._cache._quoted_text || {};
      var cached = this._cache._quoted_text[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 11;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === 'quoted-text') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 11), this._offset, []);
        this._offset = this._offset + 11;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::quoted_text', '"quoted-text"']);
        }
      }
      if (address0 !== FAILURE) {
        Object.assign(address0, this._types.QuotedText);
      }
      this._cache._quoted_text[index0] = [address0, this._offset];
      return address0;
    },

    _read_markup_attr () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._markup_attr = this._cache._markup_attr || {};
      var cached = this._cache._markup_attr[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read__();
      if (address1 !== FAILURE) {
        var address2 = FAILURE;
        address2 = this._read_attr_name();
        if (address2 !== FAILURE) {
          elements0[0] = address2;
          var address3 = FAILURE;
          address3 = this._read__();
          if (address3 !== FAILURE) {
            var address4 = FAILURE;
            var chunk0 = null, max0 = this._offset + 1;
            if (max0 <= this._inputSize) {
              chunk0 = this._input.substring(this._offset, max0);
            }
            if (chunk0 === '=') {
              address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
              this._offset = this._offset + 1;
            } else {
              address4 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push(['Lines::markup_attr', '"="']);
              }
            }
            if (address4 !== FAILURE) {
              var address5 = FAILURE;
              address5 = this._read__();
              if (address5 !== FAILURE) {
                var address6 = FAILURE;
                address6 = this._read_string();
                if (address6 !== FAILURE) {
                  elements0[1] = address6;
                  var address7 = FAILURE;
                  address7 = this._read__();
                  if (address7 !== FAILURE) {
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_attr(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._markup_attr[index0] = [address0, this._offset];
      return address0;
    },

    _read_attr_name () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._attr_name = this._cache._attr_name || {};
      var cached = this._cache._attr_name[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var chunk0 = null, max0 = this._offset + 1;
        if (max0 <= this._inputSize) {
          chunk0 = this._input.substring(this._offset, max0);
        }
        if (chunk0 !== null && /^[a-zA-Z0-9-]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push(['Lines::attr_name', '[a-zA-Z0-9-]']);
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 1) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._attr_name[index0] = [address0, this._offset];
      return address0;
    },

    _read_string () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._string = this._cache._string || {};
      var cached = this._cache._string[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_dqstring();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_sqstring();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._string[index0] = [address0, this._offset];
      return address0;
    },

    _read_sqstring () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._sqstring = this._cache._sqstring || {};
      var cached = this._cache._sqstring[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(1);
      var address1 = FAILURE;
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === '\'') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::sqstring', '"\'"']);
        }
      }
      if (address1 !== FAILURE) {
        var address2 = FAILURE;
        var index2 = this._offset, elements1 = [], address3 = null;
        while (true) {
          address3 = this._read_sstrchar();
          if (address3 !== FAILURE) {
            elements1.push(address3);
          } else {
            break;
          }
        }
        if (elements1.length >= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[0] = address2;
          var address4 = FAILURE;
          var chunk1 = null, max1 = this._offset + 1;
          if (max1 <= this._inputSize) {
            chunk1 = this._input.substring(this._offset, max1);
          }
          if (chunk1 === '\'') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push(['Lines::sqstring', '"\'"']);
            }
          }
          if (address4 !== FAILURE) {
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_string(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._sqstring[index0] = [address0, this._offset];
      return address0;
    },

    _read_dqstring () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._dqstring = this._cache._dqstring || {};
      var cached = this._cache._dqstring[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(1);
      var address1 = FAILURE;
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === '"') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::dqstring', '"\\""']);
        }
      }
      if (address1 !== FAILURE) {
        var address2 = FAILURE;
        var index2 = this._offset, elements1 = [], address3 = null;
        while (true) {
          address3 = this._read_dstrchar();
          if (address3 !== FAILURE) {
            elements1.push(address3);
          } else {
            break;
          }
        }
        if (elements1.length >= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[0] = address2;
          var address4 = FAILURE;
          var chunk1 = null, max1 = this._offset + 1;
          if (max1 <= this._inputSize) {
            chunk1 = this._input.substring(this._offset, max1);
          }
          if (chunk1 === '"') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push(['Lines::dqstring', '"\\""']);
            }
          }
          if (address4 !== FAILURE) {
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.make_string(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._dqstring[index0] = [address0, this._offset];
      return address0;
    },

    _read_sstrchar () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._sstrchar = this._cache._sstrchar || {};
      var cached = this._cache._sstrchar[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 !== null && /^[^\\'\n]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::sstrchar', '[^\\\\\'\\n]']);
        }
      }
      this._cache._sstrchar[index0] = [address0, this._offset];
      return address0;
    },

    _read_dstrchar () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._dstrchar = this._cache._dstrchar || {};
      var cached = this._cache._dstrchar[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 !== null && /^[^\\"\n]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::dstrchar', '[^\\\\"\\n]']);
        }
      }
      this._cache._dstrchar[index0] = [address0, this._offset];
      return address0;
    },

    _read__ () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache.__ = this._cache.__ || {};
      var cached = this._cache.__[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = [], address1 = null;
      while (true) {
        var chunk0 = null, max0 = this._offset + 1;
        if (max0 <= this._inputSize) {
          chunk0 = this._input.substring(this._offset, max0);
        }
        if (chunk0 !== null && /^[ \t\v\f]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push(['Lines::_', '[ \\t\\v\\f]']);
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
        } else {
          break;
        }
      }
      if (elements0.length >= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache.__[index0] = [address0, this._offset];
      return address0;
    },

    _read__newline () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache.__newline = this._cache.__newline || {};
      var cached = this._cache.__newline[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 1;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 !== null && /^[\n]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset, []);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::_newline', '[\\n]']);
        }
      }
      this._cache.__newline[index0] = [address0, this._offset];
      return address0;
    },

    _read_colon2x () {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._colon2x = this._cache._colon2x || {};
      var cached = this._cache._colon2x[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null, max0 = this._offset + 2;
      if (max0 <= this._inputSize) {
        chunk0 = this._input.substring(this._offset, max0);
      }
      if (chunk0 === '::') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset, []);
        this._offset = this._offset + 2;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push(['Lines::colon2x', '"::"']);
        }
      }
      this._cache._colon2x[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_final();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push(['Lines', '<EOF>']);
    }
    this.constructor.lastError = { offset: this._offset, expected: this._expected };
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  Object.assign(Parser.prototype, Grammar);


  function parse(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  }

  function formatError(input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }

    var line = lines[lineNo - 1],
        message = 'Line ' + lineNo + ': expected one of:\n\n';

    for (var i = 0; i < expected.length; i++) {
      message += '    - ' + expected[i][1] + ' from ' + expected[i][0] + '\n';
    }
    var number = lineNo.toString();
    while (number.length < 6) number = ' ' + number;
    message += '\n' + number + ' | ' + line + '\n';

    position -= line.length + 10;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  }

  function inherit(subclass, parent) {
    function chain () {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  }


  var exported = { Grammar: Grammar, Parser: Parser, parse: parse };

  if (typeof require === 'function' && typeof exports === 'object') {
    Object.assign(exports, exported);
  } else {
    var ns = (typeof this === 'undefined') ? window : this;
    ns.Lines = exported;
  }
})();
