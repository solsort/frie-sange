// Generated by CoffeeScript 1.6.3
(function() {
  var ajaxLegacy, use, uu,
    __slice = [].slice;

  if (typeof isNodeJs === "undefined" || typeof runTest === "undefined") {
    (function() {
      var root;
      root = typeof window === "undefined" ? global : window;
      if (typeof isNodeJs === "undefined") {
        root.isNodeJs = typeof process !== "undefined";
      }
      if (typeof isWindow === "undefined") {
        root.isWindow = typeof window !== "undefined";
      }
      if (typeof isPhoneGap === "undefined") {
        root.isPhoneGap = typeof (typeof document !== "undefined" && document !== null ? document.ondeviceready : void 0) !== "undefined";
      }
      if (typeof runTest === "undefined") {
        return root.runTest = (isNodeJs ? process.argv[2] === "test" : location.hash.slice(1) === "test");
      }
    })();
  }

  use = isNodeJs ? (function(module) {
    return require(module);
  }) : (function(module) {
    return window[module];
  });

  uu = isNodeJs ? exports : {};

  if (isWindow) {
    window.uutil = window.uu = uu;
  }

  if (Object.keys == null) {
    Object.keys = function(obj) {
      var key, _, _results;
      _results = [];
      for (key in obj) {
        _ = obj[key];
        _results.push(key);
      }
      return _results;
    };
  }

  uu.domListen = function(elem, event, fn) {
    if (elem.addEventListener) {
      return elem.addEventListener(event, fn, false);
    } else {
      return elem.attachEvent("on" + event, fn);
    }
  };

  uu.onComplete = function(fn) {
    if (isWindow) {
      if (document.readystate === "complete") {
        return fn();
      } else {
        return setTimeout((function() {
          return uu.onComplete(fn);
        }), 17);
      }
    }
  };

  uu.extend = function() {
    var key, source, sources, target, val, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (key in source) {
        val = source[key];
        target[key] = val;
      }
    }
    return target;
  };

  uu.deepCopy = function(obj) {
    var e, key, result, val, _i, _len;
    if (typeof obj === "object") {
      if (obj.constructor === Array) {
        result = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          e = obj[_i];
          result.push(uu.deepCopy(e));
        }
      } else {
        result = {};
        for (key in obj) {
          val = obj[key];
          result[key] = uu.deepCopy(val);
        }
      }
      return result;
    } else {
      return obj;
    }
  };

  uu.pick = function(arr) {
    return arr[Math.random() * arr.length | 0];
  };

  uu.prng = function(n) {
    return (1664525 * n + 1013904223) | 0;
  };

  uu.urlString = function(str) {
    var mapping;
    mapping = {
      "å": "aa",
      "Å": "Aa",
      "ø": "o",
      "Ø": "O",
      "æ": "ae",
      "Æ": "AE",
      ",": " ",
      ".": " "
    };
    return str.trim().toLocaleLowerCase().replace(/[^a-zA-Z0-9]/g, function(c) {
      return mapping[c] || " ";
    }).replace(/\ +/g, "-");
  };

  uu.strHash = function(s) {
    var hash, i;
    hash = 5381;
    i = s.length;
    while (i) {
      hash = (hash * 31 + s.charCodeAt(--i)) | 0;
    }
    return hash;
  };

  uu.xmlEscape = function(str) {
    return String(str).replace(RegExp("[\x00-\x1f\x80-\uffff&<>\"']", "g"), function(c) {
      return "&#" + (c.charCodeAt(0)) + ";";
    });
  };

  uu.obj2style = function(obj) {
    var csskey, key, val;
    return ((function() {
      var _results;
      _results = [];
      for (key in obj) {
        val = obj[key];
        csskey = key.replace(/[A-Z]/g, function(c) {
          return "-" + c.toLowerCase();
        });
        if (typeof val === "number") {
          val = "" + val + "px";
        }
        if (val && typeof val === "object" && val.constructor === Object) {
          _results.push("" + key + "{" + (uu.obj2style(val)) + "}");
        } else {
          _results.push("" + csskey + ":" + val + ";");
        }
      }
      return _results;
    })()).join("");
  };

  uu.jsonml2html = function(arr) {
    var attr, key, result, tag, val, _ref, _ref1, _ref2;
    if (!Array.isArray(arr)) {
      return "" + (uu.xmlEscape(arr));
    }
    if (arr[0] === "rawhtml") {
      return arr[1];
    }
    if (((_ref = arr[1]) != null ? _ref.constructor : void 0) !== Object) {
      arr = [arr[0], {}].concat(arr.slice(1));
    }
    attr = {};
    _ref1 = arr[1];
    for (key in _ref1) {
      val = _ref1[key];
      attr[key] = val;
    }
    if (((_ref2 = attr.style) != null ? _ref2.constructor : void 0) === Object) {
      attr.style = uu.obj2style(attr.style);
    }
    tag = arr[0].replace(/#([^.#]*)/, (function(_, id) {
      attr.id = id;
      return "";
    }));
    tag = tag.replace(/\.([^.#]*)/g, function(_, cls) {
      attr["class"] = attr["class"] === void 0 ? cls : "" + attr["class"] + " " + cls;
      return "";
    });
    result = "<" + tag + (((function() {
      var _results;
      _results = [];
      for (key in attr) {
        val = attr[key];
        _results.push(" " + key + "=\"" + (uu.xmlEscape(val)) + "\"");
      }
      return _results;
    })()).join("")) + ">";
    if (arr.length > 2) {
      result += "" + (arr.slice(2).map(uu.jsonml2html).join("")) + "</" + tag + ">";
    }
    return result;
  };

  if (false && runTest) {
    process.nextTick(function() {
      var assert, jsonml;
      assert = require("assert");
      jsonml = [
        "div.main", {
          style: {
            background: "red",
            textSize: 12
          }
        }, ["h1#theHead.foo.bar", "Blåbærgrød"], [
          "img", {
            src: "foo",
            alt: 'the "quoted"'
          }
        ], ["script", ["rawhtml", "console.log(foo<bar)"]]
      ];
      return assert.equal(jsonml2html.toString(jsonml), "<div style=\"background:red;text-size:12px\" class=\"main\"><h1 id=\"theHead\" class=\"foo bar\">Bl&#229;b&#230;rgr&#248;d</h1><img src=\"foo\" alt=\"the &#34;quoted&#34;\"><script>console.log(foo<bar)</script></div>");
    });
  }

  uu.intToColor = function(i) {
    return "#" + ((i & 0xffffff) + 0x1000000).toString(16).slice(1);
  };

  uu.hashColor = function(str) {
    return function() {
      return uu.intToColor(uu.prng(uu.strHash(str)));
    };
  };

  uu.hashColorLight = function(str) {
    return uu.intToColor(0xe0e0e0 | ((uu.prng(uu.strHash(str))) >> 3));
  };

  uu.hashColorDark = function(str) {
    return uu.intToColor(((uu.prng(uu.strHash(str))) >> 1) & 0x7f7f7f);
  };

  uu.whenDone = function(done) {
    var count, results;
    count = 0;
    results = [];
    return function() {
      var idx;
      idx = count;
      ++count;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args.push(idx);
        results.push(args);
        if (results.length === count) {
          return typeof done === "function" ? done(results) : void 0;
        }
      };
    };
  };

  uu.throttleAsyncFn = function(fn, delay) {
    var lastTime, rerun, run, running, schedule, scheduled;
    delay || (delay = 1000);
    running = [];
    rerun = [];
    scheduled = false;
    lastTime = 0;
    run = function() {
      var t;
      scheduled = false;
      t = running;
      running = rerun;
      rerun = running;
      lastTime = Date.now();
      return fn(function() {
        var args, cb, _i, _len;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = running.length; _i < _len; _i++) {
          cb = running[_i];
          cb.apply(null, args);
        }
        running.empty();
        return schedule();
      });
    };
    schedule = function() {
      if (rerun.length > 0 && running.length === 0 && !scheduled) {
        scheduled = true;
        return setTimeout(run, Math.max(0, lastTime - Date.now() - delay));
      }
    };
    return function(cb) {
      rerun.push(cb);
      return schedule();
    };
  };

  uu.nextTick = isNodeJs ? process.nextTick : function(fn) {
    return setTimeout(fn, 0);
  };

  uu.sleep = function(t, f) {
    return setTimeout(f, t * 1000);
  };

  ajaxLegacy = false;

  uu.ajax = void 0;

  if (isWindow) {
    (function() {
      var XHR;
      XHR = XMLHttpRequest;
      if (typeof (new XHR).withCredentials !== "boolean") {
        ajaxLegacy = true;
        XHR = XDomainRequest;
      }
      uu.ajax = function(url, data, cb) {
        var xhr;
        xhr = new XHR();
        xhr.onerror = function(err) {
          return typeof cb === "function" ? cb(err || true) : void 0;
        };
        xhr.onload = function() {
          return typeof cb === "function" ? cb(null, xhr.responseText) : void 0;
        };
        xhr.open((data ? "POST" : "GET"), url, !!cb);
        xhr.send(data);
        if (!cb) {
          return xhr.responseText;
        }
      };
      if (runTest) {
        return uu.nextTick(function() {
          uu.ajax("//cors-test.appspot.com/test", void 0, function(err, result) {
            return expect(result, '{"status":"ok"}', "async ajax");
          });
          return uu.ajax("//cors-test.appspot.com/test", "foo", function(err, result) {
            return expect(result, '{"status":"ok"}', "async ajax post");
          });
        });
      }
    })();
  }

  (function() {
    var logData, logId, logSyncing, logUrl, logsBeforeSync, syncDelay;
    logData = [];
    logId = Math.random();
    logUrl = "//ssl.solsort.com/api/log";
    logSyncing = false;
    logsBeforeSync = 200;
    syncDelay = 400;
    uu.syncLog = function() {
      var e, logContent;
      if (!logSyncing) {
        try {
          logContent = JSON.stringify(logData);
        } catch (_error) {
          e = _error;
          logContent = "Error stringifying log";
        }
        logSyncing = logData;
        logData = [];
        return uu.ajax(logUrl, logContent, function(err, result) {
          setTimeout((function() {
            return logSyncing = false;
          }), syncDelay);
          if (err) {
            log("logsync error", err);
            return logData = logSyncing.concat(logData);
          } else {
            logData.push([+(new Date()), "log sync'ed", logId, logData.length]);
            if ((ajaxLegacy || runTest) && logData.length > 1) {
              return uu.syncLog();
            }
          }
        });
      }
    };
    uu.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      logData.push([+(new Date())].concat(__slice.call(args)));
      if (logData.length > logsBeforeSync || ajaxLegacy || runTest) {
        uu.nextTick(uu.syncLog);
      }
      return args;
    };
    return uu.onComplete(function() {
      uu.domListen(window, "error", function(err) {
        return uu.log("window.onerror ", String(err));
      });
      uu.domListen(window, "beforeunload", function() {
        var e;
        uu.log("window.beforeunload");
        try {
          uu.ajax(logUrl, JSON.stringify(logData));
        } catch (_error) {
          e = _error;
          void 0;
        }
        return void 0;
      });
      uu.log("starting", logId, window.performance);
      return uu.log("userAgent", navigator.userAgent);
    });
  })();

}).call(this);
