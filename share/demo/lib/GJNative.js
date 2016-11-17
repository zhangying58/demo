;
(function () {


    var JSON_RPC_ERROR = {
        PARSE_ERROR: {
            code: -32700,
            message: 'Parse error'
        },
        INVALID_REQUEST: {
            code: -32600,
            message: 'Invalid Request'
        },
        METHOD_NOT_FOUND: {
            code: -32601,
            message: 'Method not found'
        },
        INVALID_PARAMS: {
            code: -32602,
            message: 'Invalid params'
        },
        INTERNAL_ERROR: {
            code: -32603,
            message: 'Internal error'
        }
    };

    var methods = {};
    var callbacks = {};
    var idCounter = 1;
    var isSupportNativeAPI = true;

    window.GJNativeAPI = window.GJNativeAPI || {};

    if (!window.GJNativeAPI.send) {
        (function () {
            var buffer = [];
            if (/ganji_\d*/.test(window.navigator.userAgent)) {
                var timer = setTimeout(function () {
                    buffer.forEach(handleInternalError);
                    window.GJNativeAPI.send = handleInternalError;
                }, 3000);

                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    clearTimeout(timer);
                    setTimeout(function () {
                        buffer.forEach(window.GJNativeAPI.send);
                    }, 10);
                }, false);

                window.GJNativeAPI.send = function (message) {
                    buffer.push(message);
                };
                return;
            }
            isSupportNativeAPI = false;
            window.GJNativeAPI.send = handleInternalError;
        })();
    }

    window.GJNativeAPI.onMessage = function (message) {
        window.console.log('native -> javascript: ' + message);
        try {
            message = JSON.parse(message);
        } catch (ex) {
            return send({
                jsonrpc: '2.0',
                error: JSON_RPC_ERROR.PARSE_ERROR,
                id: null
            });
        }
        if (message.method) {
            executeMethod(message);
        } else if (message.id) {
            handleCallback(message);
        }
    };

    function send(message) {
        window.console.log('javascript -> native: ' + JSON.stringify(message));
        window.GJNativeAPI.send(JSON.stringify(message));
    }

    function executeMethod(message) {
        var fn = methods[message.method];

        if (!fn) {
            send({
                jsonrpc: '2.0',
                error: JSON_RPC_ERROR.METHOD_NOT_FOUND,
                id: message.id || null
            });
            return;
        }
        setTimeout(function () {
            try {
                fn(message.params, function (err, result) {
                    if (!message.id) {
                        return;
                    }

                    if (err) {
                        send({
                            jsonrpc: '2.0',
                            error: {
                                code: err.code,
                                message: err.message
                            },
                            id: message.id
                        });
                    } else {
                        send({
                            jsonrpc: '2.0',
                            result: result,
                            id: message.id
                        });
                    }
                });
            } catch (ex) {
                send({
                    jsonrpc: '2.0',
                    error: {
                        code: ex.code || -32000,
                        message: ex.message
                    },
                    id: message.id
                });
            }
        }, 0);
    }

    function handleCallback(message) {
        var callback = callbacks[message.id];
        callbacks[message.id] = null;

        if (!callback) {
            return;
        }
        setTimeout(function () {
            callback(message.error || null, message.result);
        }, 0);
    }

    function handleInternalError(message) {
        try {
            message = JSON.parse(message);
        } catch (ex) {
            return;
        }
        if (message.id) {
            handleCallback({
                jsonrpc: '2.0',
                error: JSON_RPC_ERROR.INTERNAL_ERROR,
                id: message.id
            });
        }
    }

    function appGJ() {}
    appGJ.prototype = {
        registerHandler: function (name, fn) {
            methods[name] = fn;
        },
        invoke: function (method, params, callback) {
            var message = {
                jsonrpc: '2.0',
                method: method,
                params: params
            };
            var id;

            if (callback) {
                id = 'jsonp_' + idCounter;
                idCounter++;

                callbacks[id] = callback;
                message.id = id;
            }

            send(message);
        },
        isSupport: function () {
            return isSupportNativeAPI;
        }

    }
    Object.keys(JSON_RPC_ERROR).forEach(function (key) {
        appGJ.prototype[key] = JSON_RPC_ERROR[key];
    });
    var GJAPP = new appGJ();

    GJAPP.alert = function (msg) {
        GJAPP.invoke(
            'alert', {
                title: '提示',
                message: msg,
                btn_text: '确定'
            },
            function (err, data) {

            }
        );
    }
    GJAPP.loadPage = function (url, title, rightBtnTxt) {
        GJAPP.invoke(
            'createWebView', {
                url: url,
                controls: [
                    {
                        type: 'title',
                        text: title
                    },
                    {
                        type: 'headerRightBtn',
                        text: rightBtnTxt,
                        data: {
                            foo: 'bar'
                        }
                    }
            ]
            },
            function (err, data) {}
        );
    };
    GJAPP.setTitle = function (title) {
        GJAPP.invoke(
            'updateTitle', {
                text: title
            },
            function (err, data) {}
        );
    };
    GJAPP.getUserInfo = function (successCallback, cancelCallback) {
        GJAPP.invoke(
            'getUserInfo', {
                datatype: 2
            },
            function (err, data) {
                //需要先判断err，同时要判断data不为空。因为那边可能只返回一个data的空对象
                if (!err && data && data.user_sscode) {
                    // GJAPP.alert('login')
                    if (typeof successCallback == 'function') {
                        successCallback(data);
                    }
                } else {
                    // GJAPP.alert('login')
                    GJAPP.login(successCallback, cancelCallback)
                }
            }
        );
    };
    GJAPP.login = function (successCallback, cancelCallback) {
        GJAPP.invoke(
            'login', {
                logintype: 2,
                datatype: 2
            },
            function (err, data) {
                if (!err && data && data.user_sscode) {
                    // GJAPP.checkSscode(data.user_sscode,successCallback)
                    successCallback(data)
                } else {
                    if (typeof cancelCallback == 'function') {
                        cancelCallback();
                    } else {
                        GJAPP.goBack();
                    }
                }
            }
        );
    }
    GJAPP.verifyMobile = function (successCallback, cancelCallback) {
        GJAPP.invoke(
            'login', {
                logintype: 3,
                datatype: 2
            },
            function (err, data) {
                if (!err && data && data.user_sscode) {
                    GJAPP.checkSscode(data.user_sscode, successCallback)
                } else {
                    if (typeof cancelCallback == 'function') {
                        cancelCallback();
                    } else {
                        GJAPP.goBack();
                    }
                }
            }
        );
    };
    GJAPP.checkSscode = function (user_sscode, successCallback, cancelCallback) {
        // GJAPP.alert('ccc')
        $.getJSON("http://zhuanzhuan.58.com/zz/transfer/loginForGanji", {
            secretCon: user_sscode,
            rand: Math.random()
        }, function (json) {
            if (json.respCode == 0) {
                if (typeof successCallback == 'function') {
                    successCallback(json, user_sscode);
                }
            } else if (json.respCode == -2) {
                GJAPP.verifyMobile(successCallback, cancelCallback)
            }
        })
    }
    GJAPP.goBack = function () {
        GJAPP.invoke(
            'webViewCallback', {
                url: null
            },
            function (err, data) {
                if (data) {
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            }
        );
    };
    GJAPP.updateHeaderRightBtn = function (title, icon, shareMessage) {
        GJAPP.invoke(
            'updateHeaderRightBtn', {
                action: 'show',
                text: title,
                icon: icon,

            },
            function (err, data) {}
        );
        GJAPP.registerHandler(
            'headerRightBtnClick',
            function () {
                // alert(JSON.stringify(shareMessage));
                GJAPP.showShareDialog(shareMessage.title, shareMessage.title, shareMessage.desc, shareMessage.shareUrl, shareMessage.imageUrl)
            },
            function (err, data) {

            }
        );
    };
    GJAPP.set = function (key, value) {
        GJAPP.invoke(
            'storage', {
                action: 'set',
                key: key,
                value: value
            },
            function (err, data) {
                if (data) {
                    if (typeof callback == 'function') {
                        callback(data);
                    }
                }
            }
        );
    };
    GJAPP.get = function (callback) {
        GJAPP.invoke(
            'storage', {
                action: 'get',
                key: key
            },
            function (err, data) {
                if (data) {
                    if (typeof callback == 'function') {
                        callback(data);
                    }
                }
            }
        );
    }
    GJAPP.getCityInfo = function (callback) {
        GJAPP.invoke(
            "getCityInfo",
            null,
            function (err, data) {
                if (data) {
                    if (callback && typeof callback === "function") {
                        callback(data);
                    }
                }
            }

        );
    }
    GJAPP.showShareDialog = function (title, text, content, url, img, callback) {
        GJAPP.invoke(
            "showShareDialog", {
                title: title,
                text: text,
                content: content,
                url: url,
                img: img
            },
            function (err, data) {
                if (data) {
                    if (callback && typeof callback === "function") {
                        callback(data);
                    }
                }
            }

        );
    }
    GJAPP.openOutUrl = function (url, package, callback) {
        var reqData = {
                "url": url
            },
            ua = window.navigator.userAgent.toLowerCase();
        if (!ua.match(/iphone/g)) {
            reqData['package'] = package;
        }

        GJAPP.invoke(
            "openOutUrl", reqData,
            function (err, data) {
                if (data) {
                    if (callback && typeof callback === "function") {
                        callback(data);
                    }
                }
            }
        )
    }
    GJAPP.openOutApp = function (url, package, downurl, callback) {
        GJAPP.openOutUrl(url, package, function (data) {
            if (callback && typeof callback === "function") {
                callback(data);
            } else {
                if (data && data.isOpen == 1) {
                    GJAPP.openOutUrl(url);
                } else {
                    GJAPP.openOutUrl(downurl);
                }
            }
        });
    }
    GJAPP.getLocation = function (fn) {
        GJAPP.invoke(
            "getlocation", {},
            function (err, data) {
                if (err) {
                    return;
                } else {
                    fn(data);
                }
            }
        )
    }
}());
