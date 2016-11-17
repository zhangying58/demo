(function() {
    window.WeiboJSBridgeSDKOptions = {
        apiName: "Weibo"
    };
    var JS_PATH = "http://js.t.sinajs.cn/open/thirdpart/js/";
    var CSS_PATH = "appstyle/lightapp_kit/";
    var version = "20160926";
    var CONFIG = {};
    var __WeiboJSBridge;
    var bridgeBility = {};
    var bridgeAPI = null;
    var isClientAPIReady = true;

    var isWeiboClient = /weibo/i.test(navigator.userAgent);
    var weiboClientVersion = isWeiboClient ? (function() {
        var ua = navigator.userAgent;
        var reg = /__weibo__(\d+).(\d+).(\d+)/;
        if (reg.test(ua)) {
            var versionStr = RegExp.$1 + "." + RegExp.$2 + "" + RegExp.$3;
            return parseFloat(versionStr)
        }
        return null
    })() : 0;
    var isInIframe = (parent != self);
    var initSuccess = false;
    var initCallback;
    var iframeWin;
    var isSDKLoaded = 0;
    var initCount = 0;
    var resources = {
        address: {
            stylesheet: "css/pages/address_book/address_book_new.css",
            javascript: "jsapi/modules/address.js"
        },
        bottomNavigation: {
            stylesheet: "css/pages/toolbar_detail/toolbar.css",
            javascript: "jsapi/modules/bottomNavigation.js"
        },
        run: {
            javascript: "jsapi/modules/run.js"
        }
    };
    var STK = (function() {
        var that = {};
        var errorList = [];
        that.inc = function(ns, undepended) {
            return true
        };
        that.register = function(ns, maker) {
            var NSList = ns.split(".");
            var step = that;
            var k = null;
            while (k = NSList.shift()) {
                if (NSList.length) {
                    if (step[k] === undefined) {
                        step[k] = {}
                    }
                    step = step[k]
                } else {
                    if (step[k] === undefined) {
                        try {
                            step[k] = maker(that)
                        } catch(exp) {
                            errorList.push(exp)
                        }
                    }
                }
            }
        };
        that.regShort = function(sname, sfun) {
            if (that[sname] !== undefined) {
                throw "[" + sname + "] : short : has been register"
            }
            that[sname] = sfun
        };
        that.IE = /msie/i.test(navigator.userAgent);
        that.E = function(id) {
            if (typeof id === "string") {
                return document.getElementById(id)
            } else {
                return id
            }
        };
        that.C = function(tagName) {
            var dom;
            tagName = tagName.toUpperCase();
            if (tagName == "TEXT") {
                dom = document.createTextNode("")
            } else {
                if (tagName == "BUFFER") {
                    dom = document.createDocumentFragment()
                } else {
                    dom = document.createElement(tagName)
                }
            }
            return dom
        };
        that.log = function(str) {
            errorList.push("[" + ((new Date()).getTime() % 100000) + "]: " + str)
        };
        that.getErrorLogInformationList = function(n) {
            return errorList.splice(0, n || errorList.length)
        };
        return that
    })();
    $Import = STK.inc;
    STK.register("core.io.getXHR",
        function($) {
            return function() {
                var _XHR = false;
                try {
                    _XHR = new XMLHttpRequest()
                } catch(try_MS) {
                    try {
                        _XHR = new ActiveXObject("Msxml2.XMLHTTP")
                    } catch(other_MS) {
                        try {
                            _XHR = new ActiveXObject("Microsoft.XMLHTTP")
                        } catch(failed) {
                            _XHR = false
                        }
                    }
                }
                return _XHR
            }
        });
    STK.register("core.obj.parseParam",
        function($) {
            return function(oSource, oParams, isown) {
                var key, obj = {};
                oParams = oParams || {};
                for (key in oSource) {
                    obj[key] = oSource[key];
                    if (oParams[key] != null) {
                        if (isown) {
                            if (oSource.hasOwnProperty[key]) {
                                obj[key] = oParams[key]
                            }
                        } else {
                            obj[key] = oParams[key]
                        }
                    }
                }
                return obj
            }
        });
    STK.register("core.str.parseURL",
        function($) {
            return function(url) {
                var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
                var names = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
                var results = parse_url.exec(url);
                var that = {};
                for (var i = 0,
                         len = names.length; i < len; i += 1) {
                    that[names[i]] = results[i] || ""
                }
                return that
            }
        });
    STK.register("core.arr.isArray",
        function($) {
            return function(o) {
                return Object.prototype.toString.call(o) === "[object Array]"
            }
        });
    STK.register("core.str.trim",
        function($) {
            return function(str) {
                if (typeof str !== "string") {
                    throw "trim need a string as parameter"
                }
                var len = str.length;
                var s = 0;
                var reg = /(\u3000|\s|\t|\u00A0)/;
                while (s < len) {
                    if (!reg.test(str.charAt(s))) {
                        break
                    }
                    s += 1
                }
                while (len > s) {
                    if (!reg.test(str.charAt(len - 1))) {
                        break
                    }
                    len -= 1
                }
                return str.slice(s, len)
            }
        });
    STK.register("core.json.queryToJson",
        function($) {
            return function(QS, isDecode) {
                var _Qlist = $.core.str.trim(QS).split("&");
                var _json = {};
                var _fData = function(data) {
                    if (isDecode) {
                        return decodeURIComponent(data)
                    } else {
                        return data
                    }
                };
                for (var i = 0,
                         len = _Qlist.length; i < len; i++) {
                    if (_Qlist[i]) {
                        var _hsh = _Qlist[i].split("=");
                        var _key = _hsh[0];
                        var _value = _hsh[1];
                        if (_hsh.length < 2) {
                            _value = _key;
                            _key = "$nullName"
                        }
                        if (!_json[_key]) {
                            _json[_key] = _fData(_value)
                        } else {
                            if ($.core.arr.isArray(_json[_key]) != true) {
                                _json[_key] = [_json[_key]]
                            }
                            _json[_key].push(_fData(_value))
                        }
                    }
                }
                return _json
            }
        });
    STK.register("core.json.jsonToQuery",
        function($) {
            var _fdata = function(data, isEncode) {
                data = data == null ? "": data;
                data = $.core.str.trim(data.toString());
                if (isEncode) {
                    return encodeURIComponent(data)
                } else {
                    return data
                }
            };
            return function(JSON, isEncode) {
                var _Qstring = [];
                if (typeof JSON == "object") {
                    for (var k in JSON) {
                        if (k === "$nullName") {
                            _Qstring = _Qstring.concat(JSON[k]);
                            continue
                        }
                        if (JSON[k] instanceof Array) {
                            for (var i = 0,
                                     len = JSON[k].length; i < len; i++) {
                                _Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode))
                            }
                        } else {
                            if (typeof JSON[k] != "function") {
                                _Qstring.push(k + "=" + _fdata(JSON[k], isEncode))
                            }
                        }
                    }
                }
                if (_Qstring.length) {
                    return _Qstring.join("&")
                } else {
                    return ""
                }
            }
        });
    STK.register("core.util.URL",
        function($) {
            return function(sURL, args) {
                var opts = $.core.obj.parseParam({
                        isEncodeQuery: false,
                        isEncodeHash: false
                    },
                    args || {});
                var that = {};
                var url_json = $.core.str.parseURL(sURL);
                var query_json = $.core.json.queryToJson(url_json.query);
                var hash_json = $.core.json.queryToJson(url_json.hash);
                that.setParam = function(sKey, sValue) {
                    query_json[sKey] = sValue;
                    return this
                };
                that.getParam = function(sKey) {
                    return query_json[sKey]
                };
                that.setParams = function(oJson) {
                    for (var key in oJson) {
                        that.setParam(key, oJson[key])
                    }
                    return this
                };
                that.setHash = function(sKey, sValue) {
                    hash_json[sKey] = sValue;
                    return this
                };
                that.getHash = function(sKey) {
                    return hash_json[sKey]
                };
                that.valueOf = that.toString = function() {
                    var url = [];
                    var query = $.core.json.jsonToQuery(query_json, opts.isEncodeQuery);
                    var hash = $.core.json.jsonToQuery(hash_json, opts.isEncodeQuery);
                    if (url_json.scheme != "") {
                        url.push(url_json.scheme + ":");
                        url.push(url_json.slash)
                    }
                    if (url_json.host != "") {
                        url.push(url_json.host);
                        if (url_json.port != "") {
                            url.push(":");
                            url.push(url_json.port)
                        }
                    }
                    url.push("/");
                    url.push(url_json.path);
                    if (query != "") {
                        url.push("?" + query)
                    }
                    if (hash != "") {
                        url.push("#" + hash)
                    }
                    return url.join("")
                };
                return that
            }
        });
    STK.register("core.func.empty",
        function() {
            return function() {}
        });
    STK.register("core.io.ajax",
        function($) {
            return function(oOpts) {
                var opts = $.core.obj.parseParam({
                        url: "",
                        charset: "UTF-8",
                        timeout: 30 * 1000,
                        args: {},
                        onComplete: null,
                        onTimeout: $.core.func.empty,
                        uniqueID: null,
                        onFail: $.core.func.empty,
                        method: "get",
                        asynchronous: true,
                        header: {},
                        isEncode: false,
                        responseType: "json"
                    },
                    oOpts);
                if (opts.url == "") {
                    throw "ajax need url in parameters object"
                }
                var tm;
                var trans = $.core.io.getXHR();
                var cback = function() {
                    if (trans.readyState == 4) {
                        clearTimeout(tm);
                        var data = "";
                        if (opts.responseType === "xml") {
                            data = trans.responseXML
                        } else {
                            if (opts.responseType === "text") {
                                data = trans.responseText
                            } else {
                                try {
                                    if (trans.responseText && typeof trans.responseText === "string") {
                                        data = eval("(" + trans.responseText + ")")
                                    } else {
                                        data = {}
                                    }
                                } catch(exp) {
                                    data = opts.url + "return error : data error"
                                }
                            }
                        }
                        if (trans.status == 200) {
                            if (opts.onComplete != null) {
                                opts.onComplete(data)
                            }
                        } else {
                            if (trans.status == 0) {} else {
                                if (opts.onFail != null) {
                                    opts.onFail(data, trans)
                                }
                            }
                        }
                    } else {
                        if (opts.onTraning != null) {
                            opts.onTraning(trans)
                        }
                    }
                };
                trans.onreadystatechange = cback;
                if (!opts.header["Content-Type"]) {
                    opts.header["Content-Type"] = "application/x-www-form-urlencoded"
                }
                if (!opts.header["X-Requested-With"]) {
                    opts.header["X-Requested-With"] = "XMLHttpRequest"
                }
                if (opts.method.toLocaleLowerCase() == "get") {
                    var url = $.core.util.URL(opts.url, {
                        isEncodeQuery: opts.isEncode
                    });
                    url.setParams(opts.args);
                    url.setParam("__rnd", new Date().valueOf());
                    trans.open(opts.method, url, opts.asynchronous);
                    try {
                        for (var k in opts.header) {
                            trans.setRequestHeader(k, opts.header[k])
                        }
                    } catch(exp) {}
                    trans.send("")
                } else {
                    trans.open(opts.method, opts.url, opts.asynchronous);
                    try {
                        for (var k in opts.header) {
                            trans.setRequestHeader(k, opts.header[k])
                        }
                    } catch(exp) {}
                    trans.send($.core.json.jsonToQuery(opts.args, opts.isEncode))
                }
                if (opts.timeout) {
                    tm = setTimeout(function() {
                            try {
                                trans.abort();
                                opts.onTimeout({},
                                    trans);
                                opts.onFail({},
                                    trans)
                            } catch(exp) {}
                        },
                        opts.timeout)
                }
                return trans
            }
        });
    STK.register("core.dom.isNode",
        function($) {
            return function(node) {
                return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType)
            }
        });
    STK.register("core.dom.sizzle",
        function($) {
            var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                done = 0,
                toString = Object.prototype.toString,
                hasDuplicate = false,
                baseHasDuplicate = true; [0, 0].sort(function() {
                baseHasDuplicate = false;
                return 0
            });
            var Sizzle = function(selector, context, results, seed) {
                results = results || [];
                context = context || document;
                var origContext = context;
                if (context.nodeType !== 1 && context.nodeType !== 9) {
                    return []
                }
                if (!selector || typeof selector !== "string") {
                    return results
                }
                var parts = [],
                    m,
                    set,
                    checkSet,
                    extra,
                    prune = true,
                    contextXML = Sizzle.isXML(context),
                    soFar = selector,
                    ret,
                    cur,
                    pop,
                    i;
                do {
                    chunker.exec("");
                    m = chunker.exec(soFar);
                    if (m) {
                        soFar = m[3];
                        parts.push(m[1]);
                        if (m[2]) {
                            extra = m[3];
                            break
                        }
                    }
                } while ( m );
                if (parts.length > 1 && origPOS.exec(selector)) {
                    if (parts.length === 2 && Expr.relative[parts[0]]) {
                        set = posProcess(parts[0] + parts[1], context)
                    } else {
                        set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                        while (parts.length) {
                            selector = parts.shift();
                            if (Expr.relative[selector]) {
                                selector += parts.shift()
                            }
                            set = posProcess(selector, set)
                        }
                    }
                } else {
                    if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                        ret = Sizzle.find(parts.shift(), context, contextXML);
                        context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0]
                    }
                    if (context) {
                        ret = seed ? {
                            expr: parts.pop(),
                            set: makeArray(seed)
                        }: Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode: context, contextXML);
                        set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                        if (parts.length > 0) {
                            checkSet = makeArray(set)
                        } else {
                            prune = false
                        }
                        while (parts.length) {
                            cur = parts.pop();
                            pop = cur;
                            if (!Expr.relative[cur]) {
                                cur = ""
                            } else {
                                pop = parts.pop()
                            }
                            if (pop == null) {
                                pop = context
                            }
                            Expr.relative[cur](checkSet, pop, contextXML)
                        }
                    } else {
                        checkSet = parts = []
                    }
                }
                if (!checkSet) {
                    checkSet = set
                }
                if (!checkSet) {
                    Sizzle.error(cur || selector)
                }
                if (toString.call(checkSet) === "[object Array]") {
                    if (!prune) {
                        results.push.apply(results, checkSet)
                    } else {
                        if (context && context.nodeType === 1) {
                            for (i = 0; checkSet[i] != null; i++) {
                                if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                                    results.push(set[i])
                                }
                            }
                        } else {
                            for (i = 0; checkSet[i] != null; i++) {
                                if (checkSet[i] && checkSet[i].nodeType === 1) {
                                    results.push(set[i])
                                }
                            }
                        }
                    }
                } else {
                    makeArray(checkSet, results)
                }
                if (extra) {
                    Sizzle(extra, origContext, results, seed);
                    Sizzle.uniqueSort(results)
                }
                return results
            };
            Sizzle.uniqueSort = function(results) {
                if (sortOrder) {
                    hasDuplicate = baseHasDuplicate;
                    results.sort(sortOrder);
                    if (hasDuplicate) {
                        for (var i = 1; i < results.length; i++) {
                            if (results[i] === results[i - 1]) {
                                results.splice(i--, 1)
                            }
                        }
                    }
                }
                return results
            };
            Sizzle.matches = function(expr, set) {
                return Sizzle(expr, null, null, set)
            };
            Sizzle.find = function(expr, context, isXML) {
                var set;
                if (!expr) {
                    return []
                }
                for (var i = 0,
                         l = Expr.order.length; i < l; i++) {
                    var type = Expr.order[i],
                        match;
                    if ((match = Expr.leftMatch[type].exec(expr))) {
                        var left = match[1];
                        match.splice(1, 1);
                        if (left.substr(left.length - 1) !== "\\") {
                            match[1] = (match[1] || "").replace(/\\/g, "");
                            set = Expr.find[type](match, context, isXML);
                            if (set != null) {
                                expr = expr.replace(Expr.match[type], "");
                                break
                            }
                        }
                    }
                }
                if (!set) {
                    set = context.getElementsByTagName("*")
                }
                return {
                    set: set,
                    expr: expr
                }
            };
            Sizzle.filter = function(expr, set, inplace, not) {
                var old = expr,
                    result = [],
                    curLoop = set,
                    match,
                    anyFound,
                    isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
                while (expr && set.length) {
                    for (var type in Expr.filter) {
                        if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                            var filter = Expr.filter[type],
                                found,
                                item,
                                left = match[1];
                            anyFound = false;
                            match.splice(1, 1);
                            if (left.substr(left.length - 1) === "\\") {
                                continue
                            }
                            if (curLoop === result) {
                                result = []
                            }
                            if (Expr.preFilter[type]) {
                                match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                                if (!match) {
                                    anyFound = found = true
                                } else {
                                    if (match === true) {
                                        continue
                                    }
                                }
                            }
                            if (match) {
                                for (var i = 0; (item = curLoop[i]) != null; i++) {
                                    if (item) {
                                        found = filter(item, match, i, curLoop);
                                        var pass = not ^ !!found;
                                        if (inplace && found != null) {
                                            if (pass) {
                                                anyFound = true
                                            } else {
                                                curLoop[i] = false
                                            }
                                        } else {
                                            if (pass) {
                                                result.push(item);
                                                anyFound = true
                                            }
                                        }
                                    }
                                }
                            }
                            if (found !== undefined) {
                                if (!inplace) {
                                    curLoop = result
                                }
                                expr = expr.replace(Expr.match[type], "");
                                if (!anyFound) {
                                    return []
                                }
                                break
                            }
                        }
                    }
                    if (expr === old) {
                        if (anyFound == null) {
                            Sizzle.error(expr)
                        } else {
                            break
                        }
                    }
                    old = expr
                }
                return curLoop
            };
            Sizzle.error = function(msg) {
                throw "Syntax error, unrecognized expression: " + msg
            };
            var Expr = {
                order: ["ID", "NAME", "TAG"],
                match: {
                    ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                    CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                    NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                    ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                    TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                    CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
                    POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                    PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                },
                leftMatch: {},
                attrMap: {
                    "class": "className",
                    "for": "htmlFor"
                },
                attrHandle: {
                    href: function(elem) {
                        return elem.getAttribute("href")
                    }
                },
                relative: {
                    "+": function(checkSet, part) {
                        var isPartStr = typeof part === "string",
                            isTag = isPartStr && !/\W/.test(part),
                            isPartStrNotTag = isPartStr && !isTag;
                        if (isTag) {
                            part = part.toLowerCase()
                        }
                        for (var i = 0,
                                 l = checkSet.length,
                                 elem; i < l; i++) {
                            if ((elem = checkSet[i])) {
                                while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                                checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false: elem === part
                            }
                        }
                        if (isPartStrNotTag) {
                            Sizzle.filter(part, checkSet, true)
                        }
                    },
                    ">": function(checkSet, part) {
                        var isPartStr = typeof part === "string",
                            elem, i = 0,
                            l = checkSet.length;
                        if (isPartStr && !/\W/.test(part)) {
                            part = part.toLowerCase();
                            for (; i < l; i++) {
                                elem = checkSet[i];
                                if (elem) {
                                    var parent = elem.parentNode;
                                    checkSet[i] = parent.nodeName.toLowerCase() === part ? parent: false
                                }
                            }
                        } else {
                            for (; i < l; i++) {
                                elem = checkSet[i];
                                if (elem) {
                                    checkSet[i] = isPartStr ? elem.parentNode: elem.parentNode === part
                                }
                            }
                            if (isPartStr) {
                                Sizzle.filter(part, checkSet, true)
                            }
                        }
                    },
                    "": function(checkSet, part, isXML) {
                        var doneName = done++,
                            checkFn = dirCheck,
                            nodeCheck;
                        if (typeof part === "string" && !/\W/.test(part)) {
                            part = part.toLowerCase();
                            nodeCheck = part;
                            checkFn = dirNodeCheck
                        }
                        checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML)
                    },
                    "~": function(checkSet, part, isXML) {
                        var doneName = done++,
                            checkFn = dirCheck,
                            nodeCheck;
                        if (typeof part === "string" && !/\W/.test(part)) {
                            part = part.toLowerCase();
                            nodeCheck = part;
                            checkFn = dirNodeCheck
                        }
                        checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML)
                    }
                },
                find: {
                    ID: function(match, context, isXML) {
                        if (typeof context.getElementById !== "undefined" && !isXML) {
                            var m = context.getElementById(match[1]);
                            return m ? [m] : []
                        }
                    },
                    NAME: function(match, context) {
                        if (typeof context.getElementsByName !== "undefined") {
                            var ret = [],
                                results = context.getElementsByName(match[1]);
                            for (var i = 0,
                                     l = results.length; i < l; i++) {
                                if (results[i].getAttribute("name") === match[1]) {
                                    ret.push(results[i])
                                }
                            }
                            return ret.length === 0 ? null: ret
                        }
                    },
                    TAG: function(match, context) {
                        return context.getElementsByTagName(match[1])
                    }
                },
                preFilter: {
                    CLASS: function(match, curLoop, inplace, result, not, isXML) {
                        match = " " + match[1].replace(/\\/g, "") + " ";
                        if (isXML) {
                            return match
                        }
                        for (var i = 0,
                                 elem; (elem = curLoop[i]) != null; i++) {
                            if (elem) {
                                if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
                                    if (!inplace) {
                                        result.push(elem)
                                    }
                                } else {
                                    if (inplace) {
                                        curLoop[i] = false
                                    }
                                }
                            }
                        }
                        return false
                    },
                    ID: function(match) {
                        return match[1].replace(/\\/g, "")
                    },
                    TAG: function(match, curLoop) {
                        return match[1].toLowerCase()
                    },
                    CHILD: function(match) {
                        if (match[1] === "nth") {
                            var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                            match[2] = (test[1] + (test[2] || 1)) - 0;
                            match[3] = test[3] - 0
                        }
                        match[0] = done++;
                        return match
                    },
                    ATTR: function(match, curLoop, inplace, result, not, isXML) {
                        var name = match[1].replace(/\\/g, "");
                        if (!isXML && Expr.attrMap[name]) {
                            match[1] = Expr.attrMap[name]
                        }
                        if (match[2] === "~=") {
                            match[4] = " " + match[4] + " "
                        }
                        return match
                    },
                    PSEUDO: function(match, curLoop, inplace, result, not) {
                        if (match[1] === "not") {
                            if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                                match[3] = Sizzle(match[3], null, null, curLoop)
                            } else {
                                var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                                if (!inplace) {
                                    result.push.apply(result, ret)
                                }
                                return false
                            }
                        } else {
                            if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                                return true
                            }
                        }
                        return match
                    },
                    POS: function(match) {
                        match.unshift(true);
                        return match
                    }
                },
                filters: {
                    enabled: function(elem) {
                        return elem.disabled === false && elem.type !== "hidden"
                    },
                    disabled: function(elem) {
                        return elem.disabled === true
                    },
                    checked: function(elem) {
                        return elem.checked === true
                    },
                    selected: function(elem) {
                        elem.parentNode.selectedIndex;
                        return elem.selected === true
                    },
                    parent: function(elem) {
                        return !! elem.firstChild
                    },
                    empty: function(elem) {
                        return ! elem.firstChild
                    },
                    has: function(elem, i, match) {
                        return !! Sizzle(match[3], elem).length
                    },
                    header: function(elem) {
                        return (/h\d/i).test(elem.nodeName)
                    },
                    text: function(elem) {
                        return "text" === elem.type
                    },
                    radio: function(elem) {
                        return "radio" === elem.type
                    },
                    checkbox: function(elem) {
                        return "checkbox" === elem.type
                    },
                    file: function(elem) {
                        return "file" === elem.type
                    },
                    password: function(elem) {
                        return "password" === elem.type
                    },
                    submit: function(elem) {
                        return "submit" === elem.type
                    },
                    image: function(elem) {
                        return "image" === elem.type
                    },
                    reset: function(elem) {
                        return "reset" === elem.type
                    },
                    button: function(elem) {
                        return "button" === elem.type || elem.nodeName.toLowerCase() === "button"
                    },
                    input: function(elem) {
                        return (/input|select|textarea|button/i).test(elem.nodeName)
                    }
                },
                setFilters: {
                    first: function(elem, i) {
                        return i === 0
                    },
                    last: function(elem, i, match, array) {
                        return i === array.length - 1
                    },
                    even: function(elem, i) {
                        return i % 2 === 0
                    },
                    odd: function(elem, i) {
                        return i % 2 === 1
                    },
                    lt: function(elem, i, match) {
                        return i < match[3] - 0
                    },
                    gt: function(elem, i, match) {
                        return i > match[3] - 0
                    },
                    nth: function(elem, i, match) {
                        return match[3] - 0 === i
                    },
                    eq: function(elem, i, match) {
                        return match[3] - 0 === i
                    }
                },
                filter: {
                    PSEUDO: function(elem, match, i, array) {
                        var name = match[1],
                            filter = Expr.filters[name];
                        if (filter) {
                            return filter(elem, i, match, array)
                        } else {
                            if (name === "contains") {
                                return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0
                            } else {
                                if (name === "not") {
                                    var not = match[3];
                                    for (var j = 0,
                                             l = not.length; j < l; j++) {
                                        if (not[j] === elem) {
                                            return false
                                        }
                                    }
                                    return true
                                } else {
                                    Sizzle.error("Syntax error, unrecognized expression: " + name)
                                }
                            }
                        }
                    },
                    CHILD: function(elem, match) {
                        var type = match[1],
                            node = elem;
                        switch (type) {
                            case "only":
                            case "first":
                                while ((node = node.previousSibling)) {
                                    if (node.nodeType === 1) {
                                        return false
                                    }
                                }
                                if (type === "first") {
                                    return true
                                }
                                node = elem;
                            case "last":
                                while ((node = node.nextSibling)) {
                                    if (node.nodeType === 1) {
                                        return false
                                    }
                                }
                                return true;
                            case "nth":
                                var first = match[2],
                                    last = match[3];
                                if (first === 1 && last === 0) {
                                    return true
                                }
                                var doneName = match[0],
                                    parent = elem.parentNode;
                                if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                                    var count = 0;
                                    for (node = parent.firstChild; node; node = node.nextSibling) {
                                        if (node.nodeType === 1) {
                                            node.nodeIndex = ++count
                                        }
                                    }
                                    parent.sizcache = doneName
                                }
                                var diff = elem.nodeIndex - last;
                                if (first === 0) {
                                    return diff === 0
                                } else {
                                    return (diff % first === 0 && diff / first >= 0)
                                }
                        }
                    },
                    ID: function(elem, match) {
                        return elem.nodeType === 1 && elem.getAttribute("id") === match
                    },
                    TAG: function(elem, match) {
                        return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match
                    },
                    CLASS: function(elem, match) {
                        return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1
                    },
                    ATTR: function(elem, match) {
                        var name = match[1],
                            result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                            value = result + "",
                            type = match[2],
                            check = match[4];
                        return result == null ? type === "!=": type === "=" ? value === check: type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false: type === "!=" ? value !== check: type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check: type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-": false
                    },
                    POS: function(elem, match, i, array) {
                        var name = match[2],
                            filter = Expr.setFilters[name];
                        if (filter) {
                            return filter(elem, i, match, array)
                        }
                    }
                }
            };
            Sizzle.selectors = Expr;
            var origPOS = Expr.match.POS,
                fescape = function(all, num) {
                    return "\\" + (num - 0 + 1)
                };
            for (var type in Expr.match) {
                Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
                Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape))
            }
            var makeArray = function(array, results) {
                array = Array.prototype.slice.call(array, 0);
                if (results) {
                    results.push.apply(results, array);
                    return results
                }
                return array
            };
            try {
                Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
            } catch(e) {
                makeArray = function(array, results) {
                    var ret = results || [],
                        i = 0;
                    if (toString.call(array) === "[object Array]") {
                        Array.prototype.push.apply(ret, array)
                    } else {
                        if (typeof array.length === "number") {
                            for (var l = array.length; i < l; i++) {
                                ret.push(array[i])
                            }
                        } else {
                            for (; array[i]; i++) {
                                ret.push(array[i])
                            }
                        }
                    }
                    return ret
                }
            }
            var sortOrder;
            if (document.documentElement.compareDocumentPosition) {
                sortOrder = function(a, b) {
                    if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                        if (a == b) {
                            hasDuplicate = true
                        }
                        return a.compareDocumentPosition ? -1 : 1
                    }
                    var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
                    if (ret === 0) {
                        hasDuplicate = true
                    }
                    return ret
                }
            } else {
                if ("sourceIndex" in document.documentElement) {
                    sortOrder = function(a, b) {
                        if (!a.sourceIndex || !b.sourceIndex) {
                            if (a == b) {
                                hasDuplicate = true
                            }
                            return a.sourceIndex ? -1 : 1
                        }
                        var ret = a.sourceIndex - b.sourceIndex;
                        if (ret === 0) {
                            hasDuplicate = true
                        }
                        return ret
                    }
                } else {
                    if (document.createRange) {
                        sortOrder = function(a, b) {
                            if (!a.ownerDocument || !b.ownerDocument) {
                                if (a == b) {
                                    hasDuplicate = true
                                }
                                return a.ownerDocument ? -1 : 1
                            }
                            var aRange = a.ownerDocument.createRange(),
                                bRange = b.ownerDocument.createRange();
                            aRange.setStart(a, 0);
                            aRange.setEnd(a, 0);
                            bRange.setStart(b, 0);
                            bRange.setEnd(b, 0);
                            var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
                            if (ret === 0) {
                                hasDuplicate = true
                            }
                            return ret
                        }
                    }
                }
            }
            Sizzle.getText = function(elems) {
                var ret = "",
                    elem;
                for (var i = 0; elems[i]; i++) {
                    elem = elems[i];
                    if (elem.nodeType === 3 || elem.nodeType === 4) {
                        ret += elem.nodeValue
                    } else {
                        if (elem.nodeType !== 8) {
                            ret += Sizzle.getText(elem.childNodes)
                        }
                    }
                }
                return ret
            }; (function() {
                var form = document.createElement("div"),
                    id = "script" + (new Date()).getTime();
                form.innerHTML = "<a name='" + id + "'/>";
                var root = document.documentElement;
                root.insertBefore(form, root.firstChild);
                if (document.getElementById(id)) {
                    Expr.find.ID = function(match, context, isXML) {
                        if (typeof context.getElementById !== "undefined" && !isXML) {
                            var m = context.getElementById(match[1]);
                            return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined: []
                        }
                    };
                    Expr.filter.ID = function(elem, match) {
                        var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                        return elem.nodeType === 1 && node && node.nodeValue === match
                    }
                }
                root.removeChild(form);
                root = form = null
            })(); (function() {
                var div = document.createElement("div");
                div.appendChild(document.createComment(""));
                if (div.getElementsByTagName("*").length > 0) {
                    Expr.find.TAG = function(match, context) {
                        var results = context.getElementsByTagName(match[1]);
                        if (match[1] === "*") {
                            var tmp = [];
                            for (var i = 0; results[i]; i++) {
                                if (results[i].nodeType === 1) {
                                    tmp.push(results[i])
                                }
                            }
                            results = tmp
                        }
                        return results
                    }
                }
                div.innerHTML = "<a href='#'></a>";
                if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
                    Expr.attrHandle.href = function(elem) {
                        return elem.getAttribute("href", 2)
                    }
                }
                div = null
            })();
            if (document.querySelectorAll) { (function() {
                var oldSizzle = Sizzle,
                    div = document.createElement("div");
                div.innerHTML = "<p class='TEST'></p>";
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                    return
                }
                Sizzle = function(query, context, extra, seed) {
                    context = context || document;
                    if (!seed && context.nodeType === 9 && !Sizzle.isXML(context)) {
                        try {
                            return makeArray(context.querySelectorAll(query), extra)
                        } catch(e) {}
                    }
                    return oldSizzle(query, context, extra, seed)
                };
                for (var prop in oldSizzle) {
                    Sizzle[prop] = oldSizzle[prop]
                }
                div = null
            })()
            } (function() {
                var div = document.createElement("div");
                div.innerHTML = "<div class='test e'></div><div class='test'></div>";
                if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                    return
                }
                div.lastChild.className = "e";
                if (div.getElementsByClassName("e").length === 1) {
                    return
                }
                Expr.order.splice(1, 0, "CLASS");
                Expr.find.CLASS = function(match, context, isXML) {
                    if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                        return context.getElementsByClassName(match[1])
                    }
                };
                div = null
            })();
            function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
                for (var i = 0,
                         l = checkSet.length; i < l; i++) {
                    var elem = checkSet[i];
                    if (elem) {
                        elem = elem[dir];
                        var match = false;
                        while (elem) {
                            if (elem.sizcache === doneName) {
                                match = checkSet[elem.sizset];
                                break
                            }
                            if (elem.nodeType === 1 && !isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i
                            }
                            if (elem.nodeName.toLowerCase() === cur) {
                                match = elem;
                                break
                            }
                            elem = elem[dir]
                        }
                        checkSet[i] = match
                    }
                }
            }
            function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
                for (var i = 0,
                         l = checkSet.length; i < l; i++) {
                    var elem = checkSet[i];
                    if (elem) {
                        elem = elem[dir];
                        var match = false;
                        while (elem) {
                            if (elem.sizcache === doneName) {
                                match = checkSet[elem.sizset];
                                break
                            }
                            if (elem.nodeType === 1) {
                                if (!isXML) {
                                    elem.sizcache = doneName;
                                    elem.sizset = i
                                }
                                if (typeof cur !== "string") {
                                    if (elem === cur) {
                                        match = true;
                                        break
                                    }
                                } else {
                                    if (Sizzle.filter(cur, [elem]).length > 0) {
                                        match = elem;
                                        break
                                    }
                                }
                            }
                            elem = elem[dir]
                        }
                        checkSet[i] = match
                    }
                }
            }
            Sizzle.contains = document.compareDocumentPosition ?
                function(a, b) {
                    return !! (a.compareDocumentPosition(b) & 16)
                }: function(a, b) {
                return a !== b && (a.contains ? a.contains(b) : true)
            };
            Sizzle.isXML = function(elem) {
                var documentElement = (elem ? elem.ownerDocument || elem: 0).documentElement;
                return documentElement ? documentElement.nodeName !== "HTML": false
            };
            var posProcess = function(selector, context) {
                var tmpSet = [],
                    later = "",
                    match,
                    root = context.nodeType ? [context] : context;
                while ((match = Expr.match.PSEUDO.exec(selector))) {
                    later += match[0];
                    selector = selector.replace(Expr.match.PSEUDO, "")
                }
                selector = Expr.relative[selector] ? selector + "*": selector;
                for (var i = 0,
                         l = root.length; i < l; i++) {
                    Sizzle(selector, root[i], tmpSet)
                }
                return Sizzle.filter(later, tmpSet)
            };
            return Sizzle
        });
    STK.register("core.dom.contains",
        function($) {
            return function(parent, node) {
                if (parent === node) {
                    return false
                } else {
                    if (parent.compareDocumentPosition) {
                        return ((parent.compareDocumentPosition(node) & 16) === 16)
                    } else {
                        if (parent.contains && node.nodeType === 1) {
                            return parent.contains(node)
                        } else {
                            while (node = node.parentNode) {
                                if (parent === node) {
                                    return true
                                }
                            }
                        }
                    }
                }
                return false
            }
        });
    STK.register("core.evt.addEvent",
        function($) {
            return function(sNode, sEventType, oFunc) {
                var oElement = $.E(sNode);
                if (oElement == null) {
                    return false
                }
                sEventType = sEventType || "click";
                if ((typeof oFunc).toLowerCase() != "function") {
                    return
                }
                if (oElement.addEventListener) {
                    oElement.addEventListener(sEventType, oFunc, false)
                } else {
                    if (oElement.attachEvent) {
                        oElement.attachEvent("on" + sEventType, oFunc)
                    } else {
                        oElement["on" + sEventType] = oFunc
                    }
                }
                return true
            }
        });
    STK.register("core.evt.removeEvent",
        function($) {
            return function(el, evType, func, useCapture) {
                var _el = $.E(el);
                if (_el == null) {
                    return false
                }
                if (typeof func != "function") {
                    return false
                }
                if (_el.removeEventListener) {
                    _el.removeEventListener(evType, func, useCapture)
                } else {
                    if (_el.detachEvent) {
                        _el.detachEvent("on" + evType, func)
                    } else {
                        _el["on" + evType] = null
                    }
                }
                return true
            }
        });
    STK.register("core.util.browser",
        function($) {
            var ua = navigator.userAgent.toLowerCase();
            var external = window.external || "";
            var core, m, extra, version, os;
            var numberify = function(s) {
                var c = 0;
                return parseFloat(s.replace(/\./g,
                    function() {
                        return (c++==1) ? "": "."
                    }))
            };
            try {
                if ((/windows|win32/i).test(ua)) {
                    os = "windows"
                } else {
                    if ((/macintosh/i).test(ua)) {
                        os = "macintosh"
                    } else {
                        if ((/rhino/i).test(ua)) {
                            os = "rhino"
                        }
                    }
                }
                if ((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]) {
                    core = "webkit";
                    version = numberify(m[1])
                } else {
                    if ((m = ua.match(/presto\/([\d.]*)/)) && m[1]) {
                        core = "presto";
                        version = numberify(m[1])
                    } else {
                        if (m = ua.match(/msie\s([^;]*)/)) {
                            core = "trident";
                            version = 1;
                            if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
                                version = numberify(m[1])
                            }
                        } else {
                            if (/gecko/.test(ua)) {
                                core = "gecko";
                                version = 1;
                                if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                    version = numberify(m[1])
                                }
                            }
                        }
                    }
                }
                if (/world/.test(ua)) {
                    extra = "world"
                } else {
                    if (/360se/.test(ua)) {
                        extra = "360"
                    } else {
                        if ((/maxthon/.test(ua)) || typeof external.max_version == "number") {
                            extra = "maxthon"
                        } else {
                            if (/tencenttraveler\s([\d.]*)/.test(ua)) {
                                extra = "tt"
                            } else {
                                if (/se\s([\d.]*)/.test(ua)) {
                                    extra = "sogou"
                                }
                            }
                        }
                    }
                }
            } catch(e) {}
            var ret = {
                OS: os,
                CORE: core,
                Version: version,
                EXTRA: (extra ? extra: false),
                IE: /msie/.test(ua),
                OPERA: /opera/.test(ua),
                MOZ: /gecko/.test(ua) && !/(compatible|webkit)/.test(ua),
                IE5: /msie 5 /.test(ua),
                IE55: /msie 5.5/.test(ua),
                IE6: /msie 6/.test(ua),
                IE7: /msie 7/.test(ua),
                IE8: /msie 8/.test(ua),
                IE9: /msie 9/.test(ua),
                SAFARI: !/chrome\/([\d.]*)/.test(ua) && /\/([\d.]*) safari/.test(ua),
                CHROME: /chrome\/([\d.]*)/.test(ua),
                IPAD: /\(ipad/i.test(ua),
                IPHONE: /\(iphone/i.test(ua),
                ITOUCH: /\(itouch/i.test(ua),
                MOBILE: /mobile/i.test(ua)
            };
            return ret
        });
    STK.register("core.evt.getEvent",
        function($) {
            return function() {
                if ($.IE) {
                    return window.event
                } else {
                    if (window.event) {
                        return window.event
                    }
                    var o = arguments.callee.caller;
                    var e;
                    var n = 0;
                    while (o != null && n < 40) {
                        e = o.arguments[0];
                        if (e && (e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent)) {
                            return e
                        }
                        n++;
                        o = o.caller
                    }
                    return e
                }
            }
        });
    STK.register("core.evt.fixEvent",
        function($) {
            return function(e) {
                e = e || $.core.evt.getEvent();
                if (!e.target) {
                    e.target = e.srcElement;
                    e.pageX = e.x;
                    e.pageY = e.y
                }
                if (typeof e.layerX == "undefined") {
                    e.layerX = e.offsetX
                }
                if (typeof e.layerY == "undefined") {
                    e.layerY = e.offsetY
                }
                return e
            }
        });
    STK.register("core.obj.isEmpty",
        function($) {
            return function(o, isprototype) {
                var ret = true;
                for (var k in o) {
                    if (isprototype) {
                        ret = false;
                        break
                    } else {
                        if (o.hasOwnProperty(k)) {
                            ret = false;
                            break
                        }
                    }
                }
                return ret
            }
        });
    STK.register("core.evt.delegatedEvent",
        function($) {
            var checkContains = function(list, el) {
                for (var i = 0,
                         len = list.length; i < len; i += 1) {
                    if ($.core.dom.contains(list[i], el)) {
                        return true
                    }
                }
                return false
            };
            return function(actEl, expEls) {
                if (!$.core.dom.isNode(actEl)) {
                    throw "core.evt.delegatedEvent need an Element as first Parameter"
                }
                if (!expEls) {
                    expEls = []
                }
                if (!$.core.arr.isArray(expEls)) {
                    expEls = [expEls]
                }
                var evtList = {};
                var bindEvent = function(e) {
                    var evt = $.core.evt.fixEvent(e);
                    var el = evt.target;
                    var type = e.type;
                    doDelegated(el, type, evt)
                };
                var doDelegated = function(el, type, evt) {
                    var actionType = null;
                    var changeTarget = function() {
                        var path, lis, tg;
                        path = el.getAttribute("action-target");
                        if (path) {
                            lis = $.core.dom.sizzle(path, actEl);
                            if (lis.length) {
                                tg = evt.target = lis[0]
                            }
                        }
                        changeTarget = $.core.func.empty;
                        return tg
                    };
                    var checkBuble = function() {
                        var tg = changeTarget() || el;
                        if (evtList[type] && evtList[type][actionType]) {
                            return evtList[type][actionType]({
                                evt: evt,
                                el: tg,
                                box: actEl,
                                data: $.core.json.queryToJson(tg.getAttribute("action-data") || "")
                            })
                        } else {
                            return true
                        }
                    };
                    if (checkContains(expEls, el)) {
                        return false
                    } else {
                        if (!$.core.dom.contains(actEl, el)) {
                            return false
                        } else {
                            while (el && el !== actEl) {
                                if (el.nodeType === 1) {
                                    actionType = el.getAttribute("action-type");
                                    if (actionType && checkBuble() === false) {
                                        break
                                    }
                                }
                                el = el.parentNode
                            }
                        }
                    }
                };
                var that = {};
                that.add = function(funcName, evtType, process) {
                    if (!evtList[evtType]) {
                        evtList[evtType] = {};
                        $.core.evt.addEvent(actEl, evtType, bindEvent)
                    }
                    var ns = evtList[evtType];
                    ns[funcName] = process
                };
                that.remove = function(funcName, evtType) {
                    if (evtList[evtType]) {
                        delete evtList[evtType][funcName];
                        if ($.core.obj.isEmpty(evtList[evtType])) {
                            delete evtList[evtType];
                            $.core.evt.removeEvent(actEl, evtType, bindEvent)
                        }
                    }
                };
                that.pushExcept = function(el) {
                    expEls.push(el)
                };
                that.removeExcept = function(el) {
                    if (!el) {
                        expEls = []
                    } else {
                        for (var i = 0,
                                 len = expEls.length; i < len; i += 1) {
                            if (expEls[i] === el) {
                                expEls.splice(i, 1)
                            }
                        }
                    }
                };
                that.clearExcept = function(el) {
                    expEls = []
                };
                that.fireAction = function(actionType, evtType, evt, params) {
                    var actionData = "";
                    if (params && params.actionData) {
                        actionData = params.actionData
                    }
                    if (evtList[evtType] && evtList[evtType][actionType]) {
                        evtList[evtType][actionType]({
                            evt: evt,
                            el: null,
                            box: actEl,
                            data: $.core.json.queryToJson(actionData),
                            fireFrom: "fireAction"
                        })
                    }
                };
                that.fireInject = function(dom, evtType, evt) {
                    var actionType = dom.getAttribute("action-type");
                    var actionData = dom.getAttribute("action-data");
                    if (actionType && evtList[evtType] && evtList[evtType][actionType]) {
                        evtList[evtType][actionType]({
                            evt: evt,
                            el: dom,
                            box: actEl,
                            data: $.core.json.queryToJson(actionData || ""),
                            fireFrom: "fireInject"
                        })
                    }
                };
                that.fireDom = function(dom, evtType, evt) {
                    doDelegated(dom, evtType, evt || {})
                };
                that.destroy = function() {
                    for (var k in evtList) {
                        for (var l in evtList[k]) {
                            delete evtList[k][l]
                        }
                        delete evtList[k];
                        $.core.evt.removeEvent(actEl, k, bindEvent)
                    }
                };
                return that
            }
        });
    STK.register("core.dom.hasClassName",
        function($) {
            return function(node, className) {
                return (new RegExp("\\b" + className + "\\b").test(node.className))
            }
        });
    STK.register("core.dom.addClassName",
        function($) {
            return function(node, className) {
                if (node.nodeType === 1) {
                    if (!$.core.dom.hasClassName(node, className)) {
                        node.className += (" " + className)
                    }
                }
            }
        });
    STK.register("core.dom.removeClassName",
        function($) {
            return function(node, className) {
                if (node.nodeType === 1) {
                    if ($.core.dom.hasClassName(node, className)) {
                        node.className = node.className.replace(new RegExp("\\b" + className + "\\b"), " ")
                    }
                }
            }
        });
    STK.register("core.str.bLength",
        function($) {
            return function(str) {
                if (!str) {
                    return 0
                }
                var aMatch = str.match(/[^\x00-\xff]/g);
                return (str.length + (!aMatch ? 0 : aMatch.length))
            }
        });
    STK.register("core.dom.cssText",
        function($) {
            return function(oldCss) {
                oldCss = (oldCss || "").replace(/(^[^\:]*?;)|(;[^\:]*?$)/g, "").split(";");
                var cssObj = {},
                    cssI;
                for (var i = 0; i < oldCss.length; i++) {
                    cssI = oldCss[i].split(":");
                    cssObj[cssI[0].toLowerCase()] = cssI[1]
                }
                var _styleList = [],
                    that = {
                        push: function(property, value) {
                            cssObj[property.toLowerCase()] = value;
                            return that
                        },
                        remove: function(property) {
                            property = property.toLowerCase();
                            cssObj[property] && delete cssObj[property];
                            return that
                        },
                        getCss: function() {
                            var newCss = [];
                            for (var i in cssObj) {
                                newCss.push(i + ":" + cssObj[i])
                            }
                            return newCss.join(";")
                        }
                    };
                return that
            }
        });
    STK.register("core.dom.insertHTML",
        function($) {
            return function(node, html, where) {
                node = $.E(node) || document.body;
                where = where ? where.toLowerCase() : "beforeend";
                if (node.insertAdjacentHTML) {
                    switch (where) {
                        case "beforebegin":
                            node.insertAdjacentHTML("BeforeBegin", html);
                            return node.previousSibling;
                        case "afterbegin":
                            node.insertAdjacentHTML("AfterBegin", html);
                            return node.firstChild;
                        case "beforeend":
                            node.insertAdjacentHTML("BeforeEnd", html);
                            return node.lastChild;
                        case "afterend":
                            node.insertAdjacentHTML("AfterEnd", html);
                            return node.nextSibling
                    }
                    throw 'Illegal insertion point -> "' + where + '"'
                } else {
                    var range = node.ownerDocument.createRange();
                    var frag;
                    switch (where) {
                        case "beforebegin":
                            range.setStartBefore(node);
                            frag = range.createContextualFragment(html);
                            node.parentNode.insertBefore(frag, node);
                            return node.previousSibling;
                        case "afterbegin":
                            if (node.firstChild) {
                                range.setStartBefore(node.firstChild);
                                frag = range.createContextualFragment(html);
                                node.insertBefore(frag, node.firstChild);
                                return node.firstChild
                            } else {
                                node.innerHTML = html;
                                return node.firstChild
                            }
                            break;
                        case "beforeend":
                            if (node.lastChild) {
                                range.setStartAfter(node.lastChild);
                                frag = range.createContextualFragment(html);
                                node.appendChild(frag);
                                return node.lastChild
                            } else {
                                node.innerHTML = html;
                                return node.lastChild
                            }
                            break;
                        case "afterend":
                            range.setStartAfter(node);
                            frag = range.createContextualFragment(html);
                            node.parentNode.insertBefore(frag, node.nextSibling);
                            return node.nextSibling
                    }
                    throw 'Illegal insertion point -> "' + where + '"'
                }
            }
        });
    STK.register("core.util.easyTemplate",
        function($) {
            var easyTemplate = function(s, d) {
                if (!s) {
                    return ""
                }
                if (s !== easyTemplate.template) {
                    easyTemplate.template = s;
                    easyTemplate.aStatement = easyTemplate.parsing(easyTemplate.separate(s))
                }
                var aST = easyTemplate.aStatement;
                var process = function(d2) {
                    if (d2) {
                        d = d2
                    }
                    return arguments.callee
                };
                process.toString = function() {
                    return (new Function(aST[0], aST[1]))(d)
                };
                return process
            };
            easyTemplate.separate = function(s) {
                var r = /\\'/g;
                var sRet = s.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g,
                    function(a, b, c, d, e, f, g, h) {
                        if (b) {
                            return "{|}" + (c ? "-": "+") + d + "{|}"
                        }
                        if (e) {
                            return "\\'"
                        }
                        if (f) {
                            return ""
                        }
                        if (g) {
                            return "'+(" + h.replace(r, "'") + ")+'"
                        }
                    });
                return sRet
            };
            easyTemplate.parsing = function(s) {
                var mName, vName, sTmp, aTmp, sFL, sEl, aList, aStm = ["var aRet = [];"];
                aList = s.split(/\{\|\}/);
                var r = /\s/;
                while (aList.length) {
                    sTmp = aList.shift();
                    if (!sTmp) {
                        continue
                    }
                    sFL = sTmp.charAt(0);
                    if (sFL !== "+" && sFL !== "-") {
                        sTmp = "'" + sTmp + "'";
                        aStm.push("aRet.push(" + sTmp + ");");
                        continue
                    }
                    aTmp = sTmp.split(r);
                    switch (aTmp[0]) {
                        case "+et":
                            mName = aTmp[1];
                            vName = aTmp[2];
                            aStm.push('aRet.push("<!--' + mName + ' start-->");');
                            break;
                        case "-et":
                            aStm.push('aRet.push("<!--' + mName + ' end-->");');
                            break;
                        case "+if":
                            aTmp.splice(0, 1);
                            aStm.push("if" + aTmp.join(" ") + "{");
                            break;
                        case "+elseif":
                            aTmp.splice(0, 1);
                            aStm.push("}else if" + aTmp.join(" ") + "{");
                            break;
                        case "-if":
                            aStm.push("}");
                            break;
                        case "+else":
                            aStm.push("}else{");
                            break;
                        case "+list":
                            aStm.push("if(" + aTmp[1] + ".constructor === Array){with({i:0,l:" + aTmp[1] + ".length," + aTmp[3] + "_index:0," + aTmp[3] + ":null}){for(i=l;i--;){" + aTmp[3] + "_index=(l-i-1);" + aTmp[3] + "=" + aTmp[1] + "[" + aTmp[3] + "_index];");
                            break;
                        case "-list":
                            aStm.push("}}}");
                            break;
                        default:
                            break
                    }
                }
                aStm.push('return aRet.join("");');
                return [vName, aStm.join("")]
            };
            return easyTemplate
        });
    STK.register("core.util.nameValue",
        function($) {
            return function(node) {
                var _name = node.getAttribute("name");
                var _type = node.getAttribute("type");
                var _el = node.tagName;
                var _value = {
                    name: _name,
                    value: ""
                };
                var _setVl = function(vl) {
                    if (vl === false) {
                        _value = false
                    } else {
                        if (!_value.value) {
                            _value.value = $.core.str.trim((vl || ""))
                        } else {
                            _value.value = [$.core.str.trim((vl || ""))].concat(_value.value)
                        }
                    }
                };
                if (!node.disabled && _name) {
                    switch (_el) {
                        case "INPUT":
                            if (_type == "radio" || _type == "checkbox") {
                                if (node.checked) {
                                    _setVl(node.value)
                                } else {
                                    _setVl(false)
                                }
                            } else {
                                if (_type == "reset" || _type == "submit" || _type == "image") {
                                    _setVl(false)
                                } else {
                                    _setVl(node.value)
                                }
                            }
                            break;
                        case "SELECT":
                            if (node.multiple) {
                                var _ops = node.options;
                                for (var i = 0,
                                         len = _ops.length; i < len; i++) {
                                    if (_ops[i].selected) {
                                        _setVl(_ops[i].value)
                                    }
                                }
                            } else {
                                _setVl(node.value)
                            }
                            break;
                        case "TEXTAREA":
                            _setVl(node.value || node.getAttribute("value") || false);
                            break;
                        case "BUTTON":
                        default:
                            _setVl(node.value || node.getAttribute("value") || node.innerHTML || false)
                    }
                } else {
                    return false
                }
                return _value
            }
        });
    STK.register("core.util.htmlToJson",
        function($) {
            return function(mainBox, tagNameList, isClear) {
                var _retObj = {};
                tagNameList = tagNameList || ["INPUT", "TEXTAREA", "BUTTON", "SELECT"];
                if (!mainBox || !tagNameList) {
                    return false
                }
                var _opInput = $.core.util.nameValue;
                for (var i = 0,
                         len = tagNameList.length; i < len; i++) {
                    var _tags = mainBox.getElementsByTagName(tagNameList[i]);
                    for (var j = 0,
                             lenTag = _tags.length; j < lenTag; j++) {
                        var _info = _opInput(_tags[j]);
                        if (!_info || (isClear && (_info.value === ""))) {
                            continue
                        }
                        if (_retObj[_info.name]) {
                            if (_retObj[_info.name] instanceof Array) {
                                _retObj[_info.name] = _retObj[_info.name].concat(_info.value)
                            } else {
                                _retObj[_info.name] = [_retObj[_info.name]].concat(_info.value)
                            }
                        } else {
                            _retObj[_info.name] = _info.value
                        }
                    }
                }
                return _retObj
            }
        });
    STK.register("core.dom.removeNode",
        function($) {
            return function(node) {
                node = $.E(node) || node;
                try {
                    node.parentNode.removeChild(node)
                } catch(e) {}
            }
        });
    STK.register("core.util.getUniqueKey",
        function($) {
            var _loadTime = (new Date()).getTime().toString(),
                _i = 1;
            return function() {
                return _loadTime + (_i++)
            }
        });
    STK.register("core.io.scriptLoader",
        function($) {
            var entityList = {};
            var default_opts = {
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: $.core.func.empty,
                onTimeout: null,
                isEncode: false,
                uniqueID: null
            };
            return function(oOpts) {
                var js, requestTimeout;
                var opts = $.core.obj.parseParam(default_opts, oOpts);
                if (opts.url == "") {
                    throw "scriptLoader: url is null"
                }
                var uniqueID = opts.uniqueID || $.core.util.getUniqueKey();
                js = entityList[uniqueID];
                if (js != null && $.IE != true) {
                    $.core.dom.removeNode(js);
                    js = null
                }
                if (js == null) {
                    js = entityList[uniqueID] = $.C("script")
                }
                js.charset = opts.charset;
                js.id = "scriptRequest_script_" + uniqueID;
                js.type = "text/javascript";
                if (opts.onComplete != null) {
                    if ($.IE) {
                        js.onreadystatechange = function() {
                            if (js.readyState.toLowerCase() == "loaded" || js.readyState.toLowerCase() == "complete") {
                                try {
                                    clearTimeout(requestTimeout);
                                    document.getElementsByTagName("head")[0].removeChild(js);
                                    js.onreadystatechange = null
                                } catch(exp) {}
                                opts.onComplete()
                            }
                        }
                    } else {
                        js.onload = function() {
                            try {
                                clearTimeout(requestTimeout);
                                $.core.dom.removeNode(js)
                            } catch(exp) {}
                            opts.onComplete()
                        }
                    }
                }
                js.src = STK.core.util.URL(opts.url, {
                    isEncodeQuery: opts.isEncode
                }).setParams(opts.args);
                document.getElementsByTagName("head")[0].appendChild(js);
                if (opts.timeout > 0 && opts.onTimeout != null) {
                    requestTimeout = setTimeout(function() {
                            try {
                                document.getElementsByTagName("head")[0].removeChild(js)
                            } catch(exp) {}
                            opts.onTimeout()
                        },
                        opts.timeout)
                }
                return js
            }
        });
    STK.register("core.dom.getStyle",
        function($) {
            return function(node, property) {
                if ($.IE) {
                    switch (property) {
                        case "opacity":
                            var val = 100;
                            try {
                                val = node.filters["DXImageTransform.Microsoft.Alpha"].opacity
                            } catch(e) {
                                try {
                                    val = node.filters("alpha").opacity
                                } catch(e) {}
                            }
                            return val / 100;
                        case "float":
                            property = "styleFloat";
                        default:
                            var value = node.currentStyle ? node.currentStyle[property] : null;
                            return (node.style[property] || value)
                    }
                } else {
                    if (property == "float") {
                        property = "cssFloat"
                    }
                    try {
                        var computed = document.defaultView.getComputedStyle(node, "")
                    } catch(e) {}
                    return node.style[property] || computed ? computed[property] : null
                }
            }
        });
    STK.register("core.util.hideContainer",
        function($) {
            var hideDiv;
            var initDiv = function() {
                if (hideDiv) {
                    return
                }
                hideDiv = $.C("div");
                hideDiv.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
                document.getElementsByTagName("head")[0].appendChild(hideDiv)
            };
            var that = {
                appendChild: function(el) {
                    if ($.core.dom.isNode(el)) {
                        initDiv();
                        hideDiv.appendChild(el)
                    }
                },
                removeChild: function(el) {
                    if ($.core.dom.isNode(el)) {
                        hideDiv && hideDiv.removeChild(el)
                    }
                }
            };
            return that
        });
    STK.register("kit.io.cssLoader",
        function($) {
            var version = "";
            var CSSHOST = "http://img.t.sinajs.cn/t4/";
            var POOL = "http://timg.sjs.sinajs.cn/t4/";
            if (typeof $CONFIG != "undefined") {
                CSSHOST = $CONFIG.cssPath || CSSHOST;
                version = $CONFIG.version || ""
            }
            var fileCache = {};
            return function(url, load_ID, complete, giveVersion, notCdn) {
                giveVersion = giveVersion || version;
                complete = complete ||
                    function() {};
                var checkFileCache = function(url, complete) {
                    var _fileObj = fileCache[url] || (fileCache[url] = {
                            loaded: false,
                            list: []
                        });
                    if (_fileObj.loaded) {
                        complete(url);
                        return false
                    }
                    _fileObj.list.push(complete);
                    if (_fileObj.list.length > 1) {
                        return false
                    }
                    return true
                };
                var callbackFileCacheList = function(url) {
                    var cbList = fileCache[url].list;
                    for (var i = 0; i < cbList.length; i++) {
                        cbList[i](url)
                    }
                    fileCache[url].loaded = true;
                    delete fileCache[url].list
                };
                if (!checkFileCache(url, complete)) {
                    return
                }
                var fullUrl;
                if (notCdn) {
                    fullUrl = POOL + url
                } else {
                    fullUrl = CSSHOST + url + "?version=" + giveVersion
                }
                var link = $.C("link");
                link.setAttribute("rel", "Stylesheet");
                link.setAttribute("type", "text/css");
                link.setAttribute("charset", "utf-8");
                link.setAttribute("href", fullUrl);
                document.getElementsByTagName("head")[0].appendChild(link);
                var load_div = $.C("div");
                load_div.id = load_ID;
                $.core.util.hideContainer.appendChild(load_div);
                var _rTime = 3000;
                var timer = function() {
                    if (parseInt($.core.dom.getStyle(load_div, "height")) == 42) {
                        $.core.util.hideContainer.removeChild(load_div);
                        callbackFileCacheList(url);
                        return
                    }
                    if (--_rTime > 0) {
                        setTimeout(timer, 10)
                    } else {
                        $.log(url + "timeout!");
                        $.core.util.hideContainer.removeChild(load_div);
                        delete fileCache[url]
                    }
                };
                setTimeout(timer, 50)
            }
        });
    STK.register("kit.io.pjax",
        function($) {
            function getUniqueId() {
                var uid = new Date().getTime() + ("000000" + Math.floor(Math.random() * 99999)).replace(/\d+(\d{6})$/, "$1");
                return uid
            }
            var lock = false;
            var queue = [];
            var callbackHash = {};
            $.pjaxCallback = function(ret) {
                var result = ret.split(":::");
                if (result.length == 3) {
                    var uuid = result[1].replace(/\D/g, "");
                    var params = JSON.parse(result[2]);
                    if (callbackHash[uuid] != null) {
                        callbackHash[uuid](params)
                    }
                }
                lock = false
            };
            return function(spec) {
                var that = {};
                if (queue.length > 0) {
                    queue.push(spec);
                    return
                }
                var uuid = getUniqueId();
                var param = {};
                for (var key in spec) {
                    if (key == "onComplete") {
                        callbackHash[uuid] = spec[key]
                    } else {
                        param[key] = spec[key]
                    }
                }
                var key = "pjax#@#" + uuid;
                $.pjaxWin.postMessage(key + ":::" + JSON.stringify(param), "*");
                lock = true;
                return that
            }
        });
    var core = STK;
    core.ajax = STK.core.io.ajax;
    core.delegatedEvent = STK.core.evt.delegatedEvent;
    core.insertHTML = STK.core.dom.insertHTML;
    core.parseParam = STK.core.obj.parseParam;
    core.sizzle = STK.core.dom.sizzle;
    core.trim = STK.core.str.trim;
    core.easyTemplate = STK.core.util.easyTemplate;
    core.htmlToJson = STK.core.util.htmlToJson;
    core.scriptLoader = STK.core.io.scriptLoader;
    core.cssLoader = STK.kit.io.cssLoader;
    core.addClassName = STK.core.dom.addClassName;
    core.hasClassName = STK.core.dom.hasClassName;
    core.removeClassName = STK.core.dom.removeClassName;
    core.cssText = STK.core.dom.cssText;
    core.bLength = STK.core.str.bLength;
    core.pjax = STK.kit.io.pjax;
    var theia = STK;
    var comps = {};
    var h5nav;
    var device;
    var ua = navigator.userAgent;
    if (ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1) {
        device = "android"
    } else {
        if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
            device = "ios"
        } else {
            device = "other"
        }
    }
    var internal = {
        stacks: [],
        runStacks: function() {
            while (internal.stacks.length > 0) {
                var cmd = internal.stacks.shift();
                apis.invoke(cmd[0], cmd[1], cmd[2])
            }
        },
        getBrowserInfo: function(callback) {
            var info = {
                clientVersion: null,
                isWeiboClient: isWeiboClient
            };
            if (bridgeAPI != null) {
                bridgeAPI.getBrowserInfo({
                    success: function(res) {
                        info.browserType = res.browserType;
                        info.clientVersion = res.clientVersion;
                        callback && callback(info, true, WeiboJSBridge.OK)
                    }
                });
                return
            }
            if (isWeiboClient) {
                var ua = navigator.userAgent;
                var reg = /__weibo__(\d).(\d).(\d)/;
                if (reg.test(ua)) {
                    var versionStr = RegExp.$1 + "." + RegExp.$2 + "." + RegExp.$3;
                    info.clientVersion = versionStr
                }
                callback && callback(info, true, WeiboJSBridge.OK)
            } else {
                callback && callback(info, true, WeiboJSBridge.OK)
            }
        },
        createAgentIframe: function() {
            if (!CONFIG.appkey) {
                return
            }
            var iframeId = "__lightapp_agent_iframe";
            var iframe = document.createElement("iframe");
            var _loadLock = false;
            var _loadHandler = function(type) {
                if (_loadLock) {
                    return
                }
                _loadLock = true;
                iframeWin = document.getElementById(iframeId).contentWindow;
                STK.pjaxWin = iframeWin;
                internal.runPlugins()
            };
            iframe.addEventListener("load",
                function() {
                    _loadHandler("event")
                });
            iframe.src = "http://apps.weibo.com/liteblank.php?appkey=" + CONFIG.appkey;
            iframe.id = iframeId;
            iframe.style.display = "none";
            setTimeout(function() {
                    _loadHandler("timeout")
                },
                300);
            document.body.appendChild(iframe)
        },
        getUniqueId: function() {
            var uid = new Date().getTime() + ("000000" + Math.floor(Math.random() * 99999)).replace(/\d+(\d{6})$/, "$1");
            return uid
        },
        plugins: [],
        pluginsHash: {},
        runPlugin: function(cmd, params, callback) {
            if (iframeWin == null) {
                internal.plugins.push([cmd, params, callback]);
                internal.createAgentIframe()
            } else {
                var uuid = internal.getUniqueId();
                var key = cmd + "#@#" + uuid;
                internal.pluginsHash[key] = callback;
                if (cmd == "getSignedRequest" || cmd == "pjax") {
                    iframeWin.postMessage(key + ":::" + JSON.stringify(params), "*")
                } else {
                    switch (cmd) {
                        case "cashier":
                            var cashierURL = "http://pay.sc.weibo.com/api/merchant/pay/cashier?";
                            if (params.sign_type && params.sign && params.appkey && params.seller_id && params.out_pay_id && params.notify_url && params.return_url && params.subject && params.total_amount) {
                                var query = STK.core.json.jsonToQuery(params);
                                cashierURL += query;
                                window.location.href = cashierURL
                            } else {
                                callback && callback({
                                    msg: "支付参数不正确！"
                                })
                            }
                            break;
                        case "reward":
                            var rewardURL = "http://e.weibo.com/v1/public/paid/h5/rewardaccess?";
                            var error = false;
                            if (params && params.display) {
                                params.bid = "1000200977";
                                params.show_url = encodeURIComponent(window.location.href);
                                var query = STK.core.json.jsonToQuery(params);
                                rewardURL += query;
                                switch (params.display) {
                                    case "oid":
                                        if (params.seller && params.buyer && params.oid && params.share) {
                                            break
                                        } else {
                                            error = true
                                        }
                                    case "custom":
                                        if (params.seller && params.buyer && params.dis_title && params.dis_desc && params.dis_pic && params.share) {
                                            break
                                        } else {
                                            error = true
                                        }
                                    default:
                                        error = true
                                }
                            } else {
                                error = true
                            }
                            if (error) {
                                callback && callback({
                                    msg: "打赏参数不正确！"
                                })
                            } else {
                                window.location.href = rewardURL
                            }
                            break;
                        case "weiboRun":
                            internal.loadModule("run",
                                function(comp) {
                                    var run = comp;
                                    run.setParameter({
                                        appkey: CONFIG.appkey,
                                        platform: device
                                    });
                                    run.getRunData(function(o) {
                                        var result = "";
                                        if (o != null) {
                                            result = o
                                        } else {
                                            result = null
                                        }
                                        callback && callback(result)
                                    })
                                });
                            break;
                        case "deliverAddress:default":
                            internal.loadModule("address",
                                function(comp) {
                                    var address = comp;
                                    address.setParameter({
                                        appkey: CONFIG.appkey
                                    });
                                    address.getDefaultAddress(function(o) {
                                        var result = "";
                                        if (o != null) {
                                            result = o
                                        } else {
                                            result = null
                                        }
                                        callback && callback(result)
                                    })
                                });
                            break;
                        case "deliverAddress:change":
                            internal.loadModule("address",
                                function(comp) {
                                    var address = comp;
                                    address.setParameter({
                                        appkey: CONFIG.appkey
                                    });
                                    address.selectAddress(function(o) {
                                        var result = "";
                                        if (o != null) {
                                            result = o
                                        } else {
                                            result = null
                                        }
                                        callback && callback(result)
                                    })
                                });
                            break;
                        case "login":
                            if (!isWeiboClient) {
                                var loginURL = "https://m.weibo.cn/login?ns=1&backURL=";
                                if (params && params.redirect_uri && params.redirect_uri.substr(0, 30) == "http%3A%2F%2Fapps.weibo.com%2F") {
                                    loginURL += params.redirect_uri
                                } else {
                                    loginURL += encodeURIComponent(document.URL)
                                }
                                window.location.href = loginURL
                            }
                            break;
                        case "bottomNavigation:hide":
                            h5nav.hide();
                            break;
                        case "bottomNavigation:info":
                            internal.setH5NavInfo(params);
                            break;
                        case "bottomNavigation:change":
                            if (CONFIG.h5foot == null) {
                                internal.runPlugin("getSignedRequest", null,
                                    function(ret) {
                                        for (var key in ret) {
                                            if (CONFIG[key] == null) {
                                                CONFIG[key] = ret[key]
                                            }
                                        }
                                        internal.runPlugin(cmd, params, callback)
                                    })
                            } else {
                                if (typeof CONFIG != "undefined" && typeof CONFIG.h5foot != "undefined" && CONFIG.h5foot == 1) {
                                    if (h5nav == null) {
                                        internal.loadModule("bottomNavigation",
                                            function(comp) {
                                                var nav = comp;
                                                h5nav = comp;
                                                params.isHome = CONFIG.isHome;
                                                params.url = params.url || document.URL;
                                                nav.init(params)
                                            })
                                    } else {
                                        h5nav.setObject(params)
                                    }
                                }
                            }
                            break
                    }
                }
            }
        },
        runPlugins: function() {
            for (var i = 0,
                     count = internal.plugins.length; i < count; i++) {
                var plugin = internal.plugins[i];
                internal.runPlugin(plugin[0], plugin[1], plugin[2])
            }
        },
        receiveMessage: function(evt) {
            if (/^PJAX:::/i.test(evt.data)) {
                if (STK && STK.pjaxCallback) {
                    STK.pjaxCallback(evt.data);
                    return
                }
            }
            if (/^WeiboJSBridge:::/.test(evt.data) == false) {
                internal.msgHandler(evt.data)
            }
        },
        msgHandler: function(data) {
            if (!data || data.length == 0) {
                return
            }
            var info = data.split(":::");
            if (info.length == 1 || info.length == 2) {
                var cmds = info[0].split("#@#");
                if (cmds.length != 2) {
                    return
                } else {
                    if (internal.isCmdInWhiteList(cmds[0]) && /^\d+$/.test(cmds[1])) {
                        var params = null;
                        if (info.length == 2) {
                            params = (info[1] == "null" || info[1] == "") ? null: JSON.parse(info[1])
                        }
                        switch (cmds[0]) {
                            case "weiboRun":
                            case "deliverAddress:default":
                            case "deliverAddress:change":
                            case "bottomNavigation:info":
                            case "bottomNavigation:change":
                            case "bottomNavigation:hide":
                            case "getSignedRequest":
                                var callback = internal.pluginsHash[info[0]];
                                if (callback != null && typeof callback == "function") {
                                    callback(params)
                                }
                                break
                        }
                    } else {
                        return
                    }
                }
            }
        },
        bridgeScope: ["getNetworkType", "networkTypeChanged", "getBrowserInfo", "checkAvailability", "setBrowserTitle", "openMenu", "setMenuItems", "menuItemSelected", "setSharingContent", "openImage", "scanQRCode", "pickImage", "getLocation", "pickContact", "menuItemAvailable", "invokeMenuItem", "audioMetersChange"],
        CMDWhiteLists: ["weiboRun", "deliverAddress:default", "deliverAddress:change", "bottomNavigation:info", "bottomNavigation:change", "bottomNavigation:hide", "getSignedRequest", "orientationChange", "reward", "cashier"],
        AddressWhiteList: [2427861196],
        isCmdInWhiteList: function(cmd) {
            var result = false;
            var cmdList = internal.CMDWhiteLists.concat(internal.bridgeScope);
            for (var i = 0,
                     count = cmdList.length; i < count; i++) {
                if (cmdList[i] == cmd) {
                    result = true;
                    break
                }
            }
            return result
        },
        initWBSDK: function() {
            if (initCount > 10 || isSDKLoaded == 2) {
                initCallback && initCallback({
                    code: apis.STATUS_CODE.NO_RESULT,
                    msg: "初始化失败：请求模块超时�?"
                });
                return
            }
            if (isSDKLoaded == 0) {
                initCount++;
                setTimeout(internal.initWBSDK, 500);
                return
            }
            initCount = 0;
            var defaultConfig = {
                debug: false,
                appkey: "",
                timestamp: 1,
                noncestr: "",
                signature: "",
                scope: internal.bridgeScope
            };
            for (var key in CONFIG) {
                if (defaultConfig[key] != null) {
                    defaultConfig[key] = CONFIG[key]
                }
            }
            window.Weibo.ready(function(api) {
                initSuccess = true;
                isClientAPIReady = true;
                bridgeAPI = api;
                if (internal.stacks.length > 0) {
                    internal.runStacks()
                }
                api.checkAvailability({
                    api_list: internal.bridgeScope,
                    success: function(ret) {
                        var result = ret.result;
                        for (var key in result) {
                            bridgeBility[key] = result[key]
                        }
                        initCallback && initCallback({
                            code: apis.STATUS_CODE.OK,
                            msg: "初始化成�?"
                        })
                    },
                    fail: function(msg, code) {}
                })
            });
            window.Weibo.error(function(message) {
                initCallback && initCallback({
                    code: apis.STATUS_CODE.SERVICE_FORBIDDEN,
                    msg: "初始化失败，验证签名不匹配：" + message
                })
            });
            window.Weibo.config(defaultConfig)
        },
        checkBeforeInvoke: function(cmd, callback) {
            initSuccess = true;
            if (!initSuccess) {
                callback && callback({
                        error: "请先调用 WeiboJS.init() 方法进行初始化，然后再执�? WeiboJS.invoke()"
                    },
                    false, apis.STATUS_CODE.ILLEGAL_ACCESS);
                return false
            }
            if (!internal.isCmdInWhiteList(cmd)) {
                callback && callback({
                        error: "命令 " + cmd + " 不存在，请确认拼写是否正�?"
                    },
                    false, apis.STATUS_CODE.ILLEGAL_ACCESS);
                return false
            }
            if (bridgeBility[cmd] != null && bridgeBility[cmd] != true) {
                callback && callback({
                        error: "您的 appkey 没有权限调用命令 " + cmd + "，请联系王薇(wangwei16@staff.weibo.com)申请"
                    },
                    false, apis.STATUS_CODE.ILLEGAL_ACCESS);
                return false
            }
            return true
        },
        setH5NavInfo: function(info) {
            if (h5nav == null) {
                setTimeout(function() {
                        funcs.setH5NavInfo(info)
                    },
                    200);
                return
            }
            h5nav.setInfo(info)
        },
        loadModule: function(module, callback) {
            if (comps[module] != null) {
                callback(comps[module]);
                return
            }
            if (typeof resources[module] == "undefined" && typeof console != "undefined" && typeof console.log != "undefined") {
                console.log("缺少组件 " + module + " 的配置文件，请确认组件名的拼写，拼写无误请修�? /js/common/lightapp/resources.js 增加配置信息");
                return
            }
            var ver = "?version=" + version;
            if (typeof resources[module] != "undefined" && typeof resources[module]["stylesheet"] != "undefined") {
                STK.cssLoader(CSS_PATH + resources[module]["stylesheet"], "_lightapp_widget_" + module + "_",
                    function() {
                        STK.scriptLoader({
                            url: JS_PATH + resources[module]["javascript"] + ver,
                            onComplete: function() {
                                callback(comps[module])
                            }
                        })
                    },
                    version)
            } else {
                STK.scriptLoader({
                    url: JS_PATH + resources[module]["javascript"] + ver,
                    onComplete: function() {
                        callback(comps[module])
                    }
                })
            }
        },
        loadJSBridge: function() {
            var sdkpath = "http://js.t.sinajs.cn/open/thirdpart/static/jsbridge-sdk/public/weibo_mobile_sdk_min.js?version=" + version;
            STK.scriptLoader({
                url: sdkpath,
                onComplete: function() {
                    __WeiboJSBridge = window.WeiboJSBridge;
                    if (typeof window.Weibo != "undefined") {
                        isSDKLoaded = 1
                    }
                },
                onTimeout: function() {
                    isSDKLoaded = 2
                }
            })
        },
        loadOldJSBridge: function() {
            var sdkpath = "http://tjs.sjs.sinajs.cn/open/thirdpart/js/pageapp/mobile/jsapi.js";
            STK.scriptLoader({
                url: sdkpath + "?version=" + version,
                onComplete: function() {
                    __WeiboJSBridge = window.WeiboJSBridge;
                    if (typeof window.Weibo != "undefined") {
                        isSDKLoaded = 1
                    }
                },
                onTimeout: function() {
                    isSDKLoaded = 2
                }
            })
        }
    };
    var apis = {};
    apis.STATUS_CODE = {
        OK: 200,
        MISSING_PARAMS: 400,
        ILLEGAL_ACCESS: 403,
        INTERNAL_ERROR: 500,
        ACTION_NOT_FOUND: 501,
        NO_RESULT: 550,
        USER_CANCELLED: 550,
        SERVICE_FORBIDDEN: 553
    };
    apis.eventID = {
        custom_menu_selected_on: ""
    };
    apis.init = function(config, callback) {
        if (config == null || config.appkey == null || config.timestamp == null || config.noncestr == null || config.signature == null || config.scope == null) {
            callback && callback({
                code: apis.STATUS_CODE.OK,
                msg: "WeiboJS.init() 缺少必要的参�?"
            });
            initSuccess = false
        }
        CONFIG = config;
        if (isWeiboClient) {
            initCallback = callback;
            var initTime = setTimeout(internal.initWBSDK, 500);
            internal.runPlugin("bottomNavigation:change", {},
                function() {})
        } else {
            callback && callback({
                code: apis.STATUS_CODE.ILLEGAL_ACCESS,
                msg: "不在微博客户端内"
            });
            initSuccess = true
        }
    };
    apis.invoke = function(cmd, params, callback) {
        alert(isClientAPIReady);
        var args = arguments;
        if (!isWeiboClient) {
            if (cmd == "login") {
                internal.runPlugin(cmd, params, callback)
            } else {
                if ((cmd == "deliverAddress:change" || cmd == "deliverAddress:default") && internal.AddressWhiteList.indexOf(CONFIG.appkey)) {
                    internal.runPlugin(cmd, params, callback)
                } else {
                    callback && callback({
                        code: apis.STATUS_CODE.ILLEGAL_ACCESS,
                        msg: "不在微博客户端内"
                    })
                }
            }
            return
        }
        if (!isClientAPIReady) {
            internal.stacks.push(args);
            return
        }
        if (!internal.checkBeforeInvoke(cmd, callback)) {
            return
        }
        if (isClientAPIReady && bridgeAPI != null) {
            switch (cmd) {
                case "openImage":
                    var imagesCallback = {
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    };
                    if (params.url != null) {
                        imagesCallback.url = params.url
                    }
                    if (params.urls != null) {
                        imagesCallback.urls = params.urls
                    }
                    bridgeAPI.openImage(imagesCallback);
                    break;
                case "getNetworkType":
                    bridgeAPI.getNetworkType({
                        success:
                            function(ret) {
                                callback && callback(ret)
                            },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "scanQRCode":
                    bridgeAPI.scanQRCode({
                        success:
                            function(ret) {
                                callback && callback(ret)
                            },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "pickImage":
                    bridgeAPI.pickImage({
                        source:
                            (params != null && params.source != null) ? params.source: "",
                        count: (params != null && params.count != null && !isNaN(param.count)) ? params.count: 1,
                        filter: (params != null && params.filter != null) ? params.filter: false,
                        crop: (params != null && params.crop != null) ? params.crop: false,
                        return_ids: (params != null && params.return_ids != null) ? params.return_ids: false,
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "getLocation":
                    bridgeAPI.getLocation({
                        success:
                            function(ret) {
                                callback && callback(ret)
                            },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "setBrowserTitle":
                    bridgeAPI.setBrowserTitle({
                        title:
                            params.title,
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "checkAvailability":
                    callback && callback(bridgeBility);
                    break;
                case "openMenu":
                    bridgeAPI.openMenu({
                        success:
                            function(ret) {
                                callback && callback(ret)
                            },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "getBrowserInfo":
                    internal.getBrowserInfo(callback);
                    break;
                case "setMenuItems":
                    alert("join");
                    var items = {
                        shareToWeibo: {
                            title: "分享到微�?",
                            scheme: "sinaweibo://sendweibo?content=" + (params.content || ""),
                            code: 1001
                        },
                        follow: {
                            title: "关注",
                            code: 10002
                        },
                        shareToMessage: {
                            title: "分享到私�?",
                            code: 1003
                        },
                        shareToWeixin: {
                            title: "分享到微�?",
                            code: 1004
                        },
                        shareToPYQ: {
                            title: "分享到朋友圈",
                            code: 1005
                        },
                        shareToQQ: {
                            title: "分享到QQ",
                            code: 1010
                        },
                        shareToQzone: {
                            title: "分享到QZone",
                            code: 1011
                        },
                        openInBrowser: {
                            title: "浏览器打弢�",
                            code: 2001
                        },
                        copyURL: {
                            title: "复制链接",
                            code: 2002
                        }
                    };
                    var menuItems = [];
                    for (var i = 0,
                             len = params.menus.length; i < len; i++) {
                        if (items[params.menus[i]] != undefined) {
                            menuItems.push(items[params.menus[i]])
                        }
                    }
                    if (params.linkItems) {
                        var _code = 30000;
                        for (i = 0, len = params.linkItems.length; i < len; i++) {
                            if (params.linkItems[i].title && params.linkItems[i].link) {
                                menuItems.push({
                                    title: params.linkItems[i].title,
                                    scheme: params.linkItems[i].link,
                                    code: _code + i
                                })
                            }
                        }
                    }
                    if ( !! params.content) {
                        var _params = {};
                        _params.desc = params.content;
                        params.title && (_params.title = params.title);
                        params.icon && (_params.icon = params.icon);
                        apis.invoke("setSharingContent", _params)
                    }
                    bridgeAPI.setMenuItems({
                        items: menuItems,
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    if (bridgeAPI.off && apis.eventID.custom_menu_selected_on) {
                        bridgeAPI.off("menuItemSelected", apis.eventID.custom_menu_selected_on)
                    }
                    apis.eventID.custom_menu_selected_on = bridgeAPI.on("menuItemSelected", {
                        trigger: function(res) {
                            if (res.selected_code != "1001" && Number(res.selected_code) < 3000) {
                                bridgeAPI.invokeMenuItem({
                                    code: res.selected_code
                                })
                            }
                            if (res.selected_code == "10002") {
                                var ajurl = "http://apps.weibo.com/aj_followappuser.php";
                                STK.pjax({
                                    url: ajurl,
                                    method: "post",
                                    args: {
                                        appkey: CONFIG.appkey
                                    },
                                    onComplete: function(o) {
                                        if (o.code != "A00006") {} else {}
                                    }
                                })
                            }
                        }
                    });
                    break;
                case "pickContact":
                    var contactCallback = {
                        count: 1,
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    };
                    if (params != null && params.count != null && /^[1-9]\d*$/.test(params.count)) {
                        contactCallback.count = params.count
                    }
                    bridgeAPI.pickContact(contactCallback);
                    break;
                case "loginWeiboAccount":
                    break;
                case "setSharingContent":
                    var shareCallback = {
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    };
                    if (params.title != null || params.icon != null || params.desc != null) {
                        shareCallback.external = {};
                        if (params.title != null) {
                            shareCallback.external.title = params.title
                        }
                        if (params.icon != null) {
                            shareCallback.external.icon = params.icon
                        }
                        if (params.desc != null) {
                            shareCallback.external.desc = params.desc
                        }
                    }
                    bridgeAPI.setSharingContent(shareCallback);
                    break;
                case "reward":
                case "weiboRun":
                case "deliverAddress:default":
                case "deliverAddress:change":
                case "bottomNavigation:info":
                case "bottomNavigation:change":
                case "bottomNavigation:hide":
                case "getSignedRequest":
                case "login":
                    internal.runPlugin(cmd, params, callback);
                    break;
                case "menuItemAvailable":
                    bridgeAPI.menuItemAvailable({
                        success:
                            function(ret) {
                                callback && callback(ret)
                            }
                    });
                    break;
                case "invokeMenuItem":
                    bridgeAPI.invokeMenuItem({
                        code:
                            params.code,
                        success: function(ret) {
                            callback && callback(ret)
                        },
                        fail: function(msg, code) {
                            callback && callback(null, msg, code)
                        }
                    });
                    break;
                case "cashier":
                    internal.runPlugin(cmd, params, callback);
                    break
            }
        } else {
            internal.stacks.push(arguments)
        }
    };
    apis.on = function(evt, callback) {
        if (!internal.checkBeforeInvoke(evt, callback)) {
            return
        }
        if (isClientAPIReady) {
            switch (evt) {
                case "networkTypeChanged":
                    bridgeAPI.on("networkTypeChanged", {
                        trigger: function(res) {
                            callback && callback(res)
                        }
                    });
                    break;
                case "menuItemSelected":
                    bridgeAPI.on("menuItemSelected", {
                        trigger: function(res) {
                            callback && callback(res)
                        }
                    });
                    break;
                case "orientationChange":
                    window.addEventListener("orientationchange",
                        function() {
                            callback && callback({
                                orientation: window.orientation
                            })
                        },
                        false);
                    break;
                case "audioMetersChange":
                    var _opts = {};
                    _opts = {
                        trigger: function(ret) {
                            bridgeAPI.off("audioMetersChange");
                            callback && callback(ret)
                        }
                    };
                    bridgeAPI.on("audioMetersChange", _opts);
                    break
            }
        } else {
            internal.stacks.push(arguments)
        }
    };
    apis.pluginRegister = function(module, plugin) {
        comps[module] = plugin(core)
    };
    window.addEventListener("message", internal.receiveMessage, false);
    if (!isWeiboClient) {
        window.WeiboJS = apis
    } else {
        if (weiboClientVersion >= 5.28) {
            if (isInIframe) {
                internal.loadOldJSBridge()
            } else {
                internal.loadJSBridge();
                window.WeiboJS = apis
            }
        } else {
            if (isInIframe) {
                internal.loadOldJSBridge()
            } else {
                if (window.console != null && window.console.error != null) {
                    console.log("微博客户�? 5.3.0 以下版本，如果跳出了 iframe 框架，就不需要引这个 JS �?")
                }
            }
        }
    }
})();