'use strict';

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var decode$1 = createCommonjsModule(function (module) {
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  'use strict';

  // If obj.hasOwnProperty has been overridden, then calling
  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  module.exports = function (qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr,
          vstr,
          k,
          v;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  };
});

var decode$2 = interopDefault(decode$1);

var require$$1 = Object.freeze({
  default: decode$2
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var encode$1 = createCommonjsModule(function (module) {
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  'use strict';

  var stringifyPrimitive = function stringifyPrimitive(v) {
    switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  module.exports = function (obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      return Object.keys(obj).map(function (k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (Array.isArray(obj[k])) {
          return obj[k].map(function (v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  };
});

var encode$2 = interopDefault(encode$1);



var require$$0 = Object.freeze({
  default: encode$2
});

var index = createCommonjsModule(function (module, exports) {
  'use strict';

  exports.decode = exports.parse = interopDefault(require$$1);
  exports.encode = exports.stringify = interopDefault(require$$0);
});

var Qs = interopDefault(index);

/**
 * 版本号换算成数字，计算大小
 * @return {String} 版本号大小
 * @ignore
 */
function calcSize() {
	var sum = 0;

	for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
		arr[_key] = arguments[_key];
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = arr.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = slicedToArray(_step.value, 2);

			var key = _step$value[0];
			var val = _step$value[1];

			sum += val * Math.pow(10, 3 - key);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return sum;
}
/**
 * 从多个v或者zzv中提取最大值
 * @ignore
 * @return {String} v或者zzv的最大值
 */
function splitVersionFromCookie(reg) {
	for (var _len2 = arguments.length, arr = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		arr[_key2 - 1] = arguments[_key2];
	}

	var n = [],
	    dedupe = [].concat(toConsumableArray(new Set(arr)));
	dedupe.forEach(function (val, key) {
		dedupe[key] = val.replace(reg, '');
		n[key] = calcSize.apply(undefined, toConsumableArray(dedupe[key].split(".")));
	});
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = n.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _step2$value = slicedToArray(_step2.value, 2);

			var key = _step2$value[0];
			var val = _step2$value[1];

			if (val == Math.max.apply(Math, n)) {
				return dedupe[key];
			}
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
}
/**
 * 环境平台状态
 * @ignore
 */
var env = {
	/**
  * 获取移动终端
  * @ignore
  * @return {String} android | ios
  */
	getOS: function getOS() {
		return navigator.userAgent.toLowerCase().indexOf('android') > -1 ? 'android' : 'ios';
	},

	/**
  * Android的Webview中新旧SDK不并存，url中带有webview=zzn的使用新版SDK，不带的则使用旧的SDK;IOS不存在此限制
  * @ignore
  */
	isNewSDK: function isNewSDK() {
		var iszzn = /webview=zzn/.test(location.href);
		if (this.getOS() == 'android' && !iszzn) return false;
		return true;
	},


	/**
  * 获取url参数
  * @ignore
  * @param {String} key - 参数key值
  */
	getQueryParam: function getQueryParam(key) {
		var qs = location.search.length > 0 ? location.search.substr(1) : '';
		var newobj = Qs.parse(qs);
		return newobj[key] || '';
	},

	/**
     * 生成客户端所需要的对象
     * @ignore 
     */
	assignObj: function assignObj(sessionId, cmd, args) {
		return { sessionId: sessionId, cmd: cmd, args: args };
	},

	/**
  * 判断是否为空对象
  * @ignore 
  */
	isNullObj: function isNullObj(obj) {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				return false;
			}
		}
		return true;
	},


	/**
  * 获取版本号
  * @ignore
  * @return {String} 当前版本号
  */
	getVersion: function getVersion() {
		var args = document.cookie.match(/;\s{0,}(?:|zz)v=([^;]*)/g);
		var zversion = this.getQueryParam('zzv') || (args ? splitVersionFromCookie.apply(undefined, [/;\s{0,}(?:|zz)v=/g].concat(toConsumableArray(args))) : '');
		if (zversion) {
			return zversion.replace(/(^"+)|("+$)/g, '');
		}
		return '';
	}
};

/**
* createIframe
* @description 创建iframe
* @ignore
*/
var createIframe = function createIframe() {
   var iframe = document.createElement('iframe');
   iframe.style.width = '1px';
   iframe.style.height = '1px';
   iframe.style.display = 'none';
   return iframe;
};

/**
* iosExecute
* @description ios通过iframe.src发送请求给客户端
* @ignore
*/
function iosExecute(action, param) {
   param['methodName'] = action;
   var iframe = createIframe(),
       paramStr = JSON.stringify(param);
   iframe.src = 'http://zhuanzhuan.hybrid.ios/?infos=' + encodeURIComponent(paramStr);
   document.body.appendChild(iframe);
   console.group('ios新版接口请求');
   console.log('param:' + paramStr);
   console.log('requestUrl:' + iframe.src);
   console.groupEnd();
   setTimeout(function () {
      return iframe.remove();
   }, 300);
}
/**
* andrExecute
* @description 调用andr 外放的接口executeCmd 发送参数
* @ignore
*/
function andrExecute(action, param) {
   console.group('andr新版接口请求');
   console.log('param:' + JSON.stringify(param));
   console.log('action:' + action);
   console.log('android外露接口:' + zhuanzhuanMApplication);
   console.groupEnd();
   if (window.zhuanzhuanMApplication) {
      var oriParam = JSON.stringify(param);
      window.zhuanzhuanMApplication.executeCmd(action, oriParam);
   }
}
/**
* invoke
* @description 传行为类型和参数给客户端
* @ignore
*/
function newInvoke (action, param, callback) {
   param['callback'] = callback;
   if (env.getOS() == 'android') {
      andrExecute(action, param);
   } else {
      iosExecute(action, param);
   }
}

var transcode = {
    /**
     * base64编码
     * @param {Object} str
     * @ignore
     */
    base64encode: function base64encode(str) {
        var out, i, len;
        var c1,
            c2,
            c3,
            base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
            out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },

    /**
     * base64解码
     * @param {Object} str
     * @ignore
     */
    base64decode: function base64decode(str) {
        var c1, c2, c3, c4;
        var i,
            len,
            out,
            base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode((c3 & 0x03) << 6 | c4);
        }
        return out;
    },

    /**
     * utf16转utf8
     * @param {Object} str
     * @ignore
     */
    utf16to8: function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x0001 && c <= 0x007F) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
                out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
                out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
            } else {
                out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
                out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
            }
        }
        return out;
    },

    /**
     * utf8转utf16
     * @param {Object} str
     * @ignore
     */
    utf8to16: function utf8to16(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
                    break;
                case 14:
                    // 1110 xxxx10xx xxxx10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
                    break;
            }
        }
        return out;
    }
};

/**
 * 兼容低版本,生成sessionId
 * @ignore 
 */
var generateId = function generateId() {
    return new Date().getTime() + '' + Math.floor(Math.random() * 100000);
};

var os = env.getOS();
/**
 * 遍历数组，生成有序数组
 * @ignore 
 */
function arrErgodic(param, callback, arr) {
    var nullArr = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    if (!env.isNullObj(param) && arr.length > 0) {
        arr.forEach(function (ele) {
            var arrVal = param[ele] != undefined ? param[ele] : "";
            nullArr.push(arrVal);
        });
    }
    if (callback != '') {
        nullArr.push(callback);
    }
    return nullArr;
}
/**
 * 兼容低版本,android通过外露接口调取，ios通过url拦截调取入参
 * @ignore 
 */
function lowerVersionExecute(sessionId, cmd, args) {
    var obj = env.assignObj(sessionId, cmd, args);
    var finalStr = transcode.base64encode(transcode.utf16to8(JSON.stringify(obj)));
    console.group('老版接口请求');
    console.log('infos:' + finalStr);
    console.dir(obj);
    console.groupEnd();
    if (os == 'android') {
        if (window.bangbangMApplication) {
            window.bangbangMApplication.executeCmd(finalStr);
        }
    } else {
        window.location.href = "http://bangbang.ios/" + finalStr;
    }
}

/**
 * 低版本执行调起,ios中分享，登录，首页，发布接口，与android不一致，单独处理
 * @ignore 
 */
function oldInvoke (action, param, callback, arr) {
    var _array = arrErgodic(param, callback, arr),
        methodMap = { 'share': 'bb_share', 'login': 'bb_login' },
        nameMap = { 'enterHome': 'ZZHomePageViewController', 'enterPublish': 'ZZSellPublishViewController' };
    var invokeMethod = methodMap[action] || 'invokeMethod',
        className = nameMap[action] || '';
    invokeMethod = os == 'ios' ? invokeMethod : 'invokeMethod';
    className = os == 'ios' ? className : '';
    if (invokeMethod == 'invokeMethod') {
        _array.splice(0, 0, action);
    }
    if (className) {
        lowerVersionExecute(generateId(), invokeMethod, ['pushViewController', className]);
    } else {
        lowerVersionExecute(generateId(), invokeMethod, _array);
    }
}

/**
 * 设置过期时间
 * @ignore
 */
function expiresTime(time) {
    var date = new Date();
    date.setTime(date.getTime() + time);
    return date;
}
/**
 * 添加cookie值
 * @ignore
 */
function addCookie(key) {
    var flag = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var exp = flag ? expiresTime(3600 * 24 * 1000) : expiresTime(-1);
    document.cookie = key + ';domain=58.com; path=/; expires=' + exp.toGMTString();
}
/**
 * 遍历数组元素，添加到document.cookie中
 * @ignore
 */
function arrMap(cookie) {
    var flag = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var isCall = cookie ? true : false,
        cookieArr = cookie.split(';');

    if (isCall) {
        cookieArr.map(function (item) {
            if (flag) {
                addCookie(item, true);
            } else {
                var key = item.split('=')[0].trim();
                if (key.match(/(^| )uid$/) || key.match(/(^| )PPU$/) || key.match(/(^| )userInfo$/)) {
                    addCookie(key + '=0');
                }
            }
        });
        if (flag) {
            var uid = cookie.match(/UID=(\d+)/)[1] || '';
            addCookie('uid=' + uid, true);
        }
    }
}
/**
 * 前端把PPU写入cookie
 * @ignore
 */
function injectCookie (sessionid, cookie) {
    var flag = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!flag) cookie = transcode.utf8to16(transcode.base64decode(cookie));
    arrMap(document.cookie);
    arrMap(cookie, true);
}

/**
 * 声明参数变量
 * @ignore
 */
var os$1 = env.getOS();
var version = env.getVersion();
var sdk = env.isNewSDK();
var idCounter = 0;
/**
 * 判断参数是否为函数
 * @ignore
 */

var isFunction = function isFunction(fn) {
	return Object.prototype.toString.call(fn) === '[object Function]';
};
/**
 * 为回调函数名生成一个全局唯一的id
 * @ignore
 */
function uniqId(prefix) {
	var id = idCounter++;
	return prefix ? prefix + id : id;
}

/**
 * 封装回调函数，放入全局中
* @ignore 
*/
function actualCallback(callback, del) {
	var callbackName = "zzcallback_" + uniqId();
	window[callbackName] = function (state, res) {
		switch (state) {
			case "0":
				try {
					res = /^\{.*\}$/.test(res) ? JSON.parse(res) : res;
					callback(res);
				} catch (e) {
					if ("development" != 'production') {
						alert('res字符串不能正确被解析成json对象');
					}
				}
				break;
			case "-1":
				if ("development" != 'production') {
					alert('低版本没有此方法');
				}
				break;
			case "-2":
				if ("development" != 'production') {
					alert('入参格式错误');
				}
				break;
			default:
				callback();
				break;
		}
		if (del) delete window[callbackName];
	};
	return callbackName;
}

/**
 * 暴露一个回调CB对象
 * @type {{getCallbackName: ((callback)), getLoginCallback: ((callback))}}
 * @ignore
 */
var CB = {
	/**
  * 返回客户端所需的回调函数名
  * @ignore
  */
	getCallbackName: function getCallbackName(callback) {
		var del = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		return isFunction(callback) ? actualCallback(callback, del) : '';
	},

	/**
  * getCookie接口的回调函数,把PPU注入cookie
  * @ignore
  */
	getCookieCallback: function getCookieCallback(callback) {
		var getCookieCallName = 'zzcallback_getcookie';
		var isCall = isFunction(callback);
		window[getCookieCallName] = function (state, res) {
			switch (state) {
				case "0":
					var isNew = /^\{.*\}$/.test(res) ? true : false;
					if (isNew) {
						res = JSON.parse(res);
						injectCookie('', res.cookie, true);
					} else {
						injectCookie('', res);
					}
					if (isCall) callback(res);
					break;
				case "-2":
					alert('入参格式错误');
					break;
			}
			delete window[getCookieCallName];
		};
		return getCookieCallName;
	},

	/**
  * 登录回调函数中调用getCookie接口，在其回调中主动把PPU写入cookie,解决ios不能及时写入cookie的问题
  * @ignore
  */
	getLoginCallback: function getLoginCallback(callback) {
		var _this = this;

		var loginCallName = 'zzcallback_login';
		var hasCall = isFunction(callback) ? true : false;
		if (os$1 == 'android' && version > '2.2.0' && sdk) {
			return this.getCallbackName(callback);
		} else if (!hasCall && os$1 == 'android') {
			return '';
		} else {
			window[loginCallName] = function (state, res) {
				switch (state) {
					case "0":
						var isNew = /^\{.*\}$/.test(res) ? true : false;
						if (isNew) {
							newInvoke('getCookie', {}, _this.getCookieCallback());
						} else {
							injectCookie('', res);
						}
						if (hasCall) callback(res);
						break;
					case "-2":
						if ("development" != 'production') {
							alert('入参格式错误');
						}
						break;
				}
				delete window[loginCallName];
			};
			return loginCallName;
		}
	}
};

/**
 * Class representing a zzJsBridge.
 * @ignore
 */
var ZZJsBridge = function () {
			/**
       * Create a zzJsBridge.
       * @param {string} version - 版本号
       */
			function ZZJsBridge() {
						var version = arguments.length <= 0 || arguments[0] === undefined ? '0.0' : arguments[0];
						classCallCheck(this, ZZJsBridge);

						this.version = version;
						this.init();
			}
			/**
   * 初始化，获取移动平台和版本号
   * @ignore
   */


			createClass(ZZJsBridge, [{
						key: 'init',
						value: function init() {
									this.version = env.getVersion();
									this.sdk = env.isNewSDK();
									window.setCookie4FE = function (sessionid, cookie) {
												injectCookie(sessionid, cookie);
									};
						}
						/**
       * 兼容高低版本 调用不同的invoke接口
      * @ignore 
      */

			}, {
						key: 'compatInvoke',
						value: function compatInvoke(action, param, callback) {
									var arr = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

									if (this.version >= '2.2.0' && this.sdk) {
												newInvoke(action, param, callback);
									} else {
												oldInvoke(action, param, callback, arr);
									}
						}

						/**
      * 验证参数是否是json对象
      * @ignore
      */

			}, {
						key: 'validType',
						value: function validType(obj) {
									try {
												if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' && Object.prototype.toString.call(obj).toLowerCase() == '[object object]' && !obj.length) {
															console.log('传参json格式正确！');
															console.dir(obj);
															return obj;
												}
									} catch (e) {
												console.log(e);
												return;
									}
						}
						/**
       * @method login
       * @description 调用native登录页
       * @param {loginCallback} [callback] - 选填项，回调函数
       * 
       *
       *     @example
       *     function callback(res){
       *     	// TODO;
       *     }
       * ZZAPP.login(callback);
       *
       */
						/**
       * 登录后执行回调
       * @callback loginCallback
       * @param {Object} res - 业务层所需参数 json串格式{"code" : code,"data" : data,"msg":msg}
       * @param {String} res.code - code : 0登录成功 -1登录失败 -100出错信息（业务层的相关状态）
       * @param {Object} res.cookie -业务层所需cookie 
       * @param {String} res.msg -提示信息
       */

			}, {
						key: 'login',
						value: function login(callback) {
									this.compatInvoke('login', {}, CB.getLoginCallback(callback));
						}
						/**
       * @method setSearchBtn
       * @description 新增接口,调用右上角搜索按钮
       * @param {callback} [callback] - 选填项，回调函数
       *
       *
       *     @example
       *     function callback(res){
       *     	// TODO;
       *     }
       * ZZAPP.setSearchBtn(callback);
       *
       */

			}, {
						key: 'setSearchBtn',
						value: function setSearchBtn(callback) {
									newInvoke('setSearchButton', {}, CB.getCallbackName(callback));
						}
						/**
       * 调用native设置title功能
       * @method setTitle
       * @description 调用native设置title功能
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.title - 必填项，页面标题
       * @param {callback} [callback] - 选填项，回调函数
       *
       *     	@example
       *      var obj ={
       *      	"title": title    	    
          *      };
       *
       * ZZAPP.setTitle(obj,callback);
       */

			}, {
						key: 'setTitle',
						value: function setTitle(obj, callback) {
									this.validType(obj);
									var arr = ['title'];
									this.compatInvoke('setNativeTitle', obj, CB.getCallbackName(callback), arr);
						}
						/**
      * @method setRightBtn
      * @description 调用native设置头部右边按钮跳转M页
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.label 必填项，按钮文案
      * @param {String} obj.url 必填项，如跳转web页为url
      * @param {String} [obj.newPageTitle] 选填项，如跳转页面的标题
      * @param {String} [obj.needLogin] 选填项，是否需要登录（0 不需要；1 需要）
      * @param {String} [obj.color] 选填项，按钮文案颜色（默认 #FB5329）
      * @param {callback} [callback] 选填项，回调函数
      *
      *     @example
      *     var obj = {
      *          "label": label,
      *          "url":url,
      *          "newPageTitle":newPageTitle,
      *          "needLogin":needLogin,
      *          "color":color
      *     };
      * ZZAPP.setRightBtn(obj,callback);
      */

			}, {
						key: 'setRightBtn',
						value: function setRightBtn(obj, callback) {
									this.validType(obj);
									var arr = ['label', 'url', 'needLogin'];
									this.compatInvoke('setRightButton', obj, CB.getCallbackName(callback), arr);
						}
						/**
      * @method setRightNativeBtn 
      * @description 新增接口，调用native设置头部右边按钮跳转native页
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.label 必填项，按钮文案
      * @param {String} obj.page 必填项，native页面标识（-1 跳转目的页由本页面指定；0 发布页；1 商品详情页；2 订单详情页；3城市定位页）
      * @param {String} [obj.idParam] 选填项，native页面需要的id ，如商品id
      * @param {String} [obj.needLogin] 选填项，是否需要登录（0 不需要；1 需要）
      * @param {String} [obj.color] 选填项，按钮文案颜色（默认 #FB5329）
      * @param {callback} [callback] 选填项，回调函数
      *
      *     @example
      *     var obj = {
      *          "label": label,
      *          "page":page,
      *          "idParam":idParam,
      *          "needLogin":needLogin,
      *          "color":color
      *     };
      * ZZAPP.setRightNativeBtn(obj,callback);
      */

			}, {
						key: 'setRightNativeBtn',
						value: function setRightNativeBtn(obj, callback) {
									this.validType(obj);
									newInvoke('setRightNativeButton', obj, CB.getCallbackName(callback, false));
						}
						/**
      * @method editPublish
      * @description 新增接口，进入编辑发布页
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.infoId 必填项，编辑的商品id
      * @param {callback} [callback] 选填项，回调函数
      *
      *     @example
      *     var obj = {
      *          "infoId": infoId
      *     };
      * ZZAPP.editPublish(obj,callback);
      */

			}, {
						key: 'editPublish',
						value: function editPublish(obj, callback) {
									this.validType(obj);
									newInvoke('enterEditPublish', obj, CB.getCallbackName(callback));
						}
						/**
      * @method setShareData
      * @description 新增接口，设置分享数据（优品商品详情专用）
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.nowPrice 必填项，商品现价
      * @param {String} obj.title 必填项，商品标题
      * @param {String} obj.content 必填项，商品内容
      * @param {String} obj.picPaths 必填项，商品图片地址（多个地址用 | 分隔）
      * @param {String} obj.url 必填项，商品M页地址
      * @param {callback} [callback] 选填项，回调函数
      *
      *     @example
      *     var obj = {
      *          "nowPrice": nowPrice,
      *          "title": title,
      *          "content": content,
      *          "picPaths": picPaths,
      *          "url": url
      *     };
      * ZZAPP.setShareData(obj,callback);
      */

			}, {
						key: 'setShareData',
						value: function setShareData(obj, callback) {
									this.validType(obj);
									newInvoke('setInfoShareData', obj, CB.getCallbackName(callback));
						}
						/**
      * @method setRightShareBtn
      * @description  设置头部右边显示分享按钮
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.title 必填项，分享标题
      * @param {String} obj.content 必填项，分享内容
      * @param {String} obj.picPath 必填项，分享图片地址
      * @param {String} obj.url 必填项，分享跳转地址
      * @param {String} [obj.logParam] 选填项，分享成功后要上报的参数(如主题id或好友在卖等活动标识)
      * @param {String} [obj.posterPicPath] 选填项，分享海报底图地址
      * @param {String} [obj.panelType] 选填项，分享面板类型(allChannel：全渠道， onlyWeixin：只有微信、朋友圈)
      * @param {String} [obj.shareType] 选填项，分享类型(common：普通， poster：海报)
      * @param {String} [obj.buttonType] 选填项，分享按钮类型(icon：图标，label：文字)
      * @param {String} [obj.needLogin] 选填项，点击右侧按钮时是否需要登录 “0”：不需要登录 “1”：需要登录
      * @param {String} [obj.twoDimensionCodeX] 选填项，二维码的X坐标(qrX，qrY，qrW三个参数若有一个未传，则海报使用固定大小风格，若全部传入，则海报大小是server端下发的实际大小)
      * @param {String} [obj.twoDimensionCodeY] 选填项，二维码的Y坐标
      * @param {String} [obj.twoDimensionCodeW] 选填项，二维码的宽度(方形)
      * @param {String} [obj.twoDimensionCodeColor] 选填项，二维码的颜色(示例 #00ff00)
      * @param {String} [obj.color] 选填项，按钮文案颜色（默认 #FB5329）
      * @param {shareCallback} [callback] 选填项，回调函数
      *
      *     @example
      *     var obj = {
      *          "title" : title,
      *          "content" : content,
      *          "picPath" : picPath,
      *          "url" : url,
      *          "logParam" : logParam,
      *          "posterPicPath" :　posterPicPath,
      *          "panelType" : panelType,
      *          "shareType" : shareType,
      *          "buttonType" : buttonType,
      *          "needLogin" : needLogin,
      *          "twoDimensionCodeX" : qrX,
      *          "twoDimensionCodeY" : qrY,
      *          "twoDimensionCodeW" : qrW,
      *          "twoDimensionCodeColor" : qrColor,
      *          "color" : color
      *     }
      * ZZAPP.setRightShareBtn(obj,callback);
      *
      */

			}, {
						key: 'setRightShareBtn',
						value: function setRightShareBtn(obj, callback) {
									this.validType(obj);
									var arr = ['title', 'content', 'picPath', 'url', 'logParam', 'posterPicPath', 'panelType', 'shareType', 'buttonType', 'needLogin'];
									this.compatInvoke('setRightShareButton', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * 分享回调
       * @callback shareCallback
       * @param {Object} res - 业务层所需参数 json串格式{"code" ：code,"data" : data,"msg":msg}
       * @param {String} res.code - code : 0分享成功 -1分享失败 -2分享取消 -100出错信息（业务层的相关状态）
       * @param {String} res.msg - 每个状态所对应的提示信息，或者为空字符" "，如"分享成功"、"分享失败"、"分享取消"
       */
						/**
      * @method setSharePanel
      * @description 调起分享面板
      * @param {Object} obj - 必填项，以json对象形式传参
      * @param {String} obj.title 必填项，分享标题
      * @param {String} obj.content 必填项，分享内容
      * @param {String} obj.picPath 必填项，分享图片地址
      * @param {String} obj.url 必填项，分享跳转地址
      * @param {String} [obj.logParam] 选填项，分享成功后要上报的参数(如主题id或好友在卖等活动标识)
      * @param {String} [obj.posterPicPath] 选填项，分享海报底图地址
      * @param {String} [obj.panelType] 选填项，分享面板类型(allChannel：全渠道， onlyWeixin：只有微信、朋友 
      * 圈)
      * @param {String} [obj.shareType] 选填项，分享类型(common：普通， poster：海报)
      * @param {String} [obj.twoDimensionCodeX] 选填项，二维码的X坐标(qrX，qrY，qrW三个参数若有一个未传，则海报使用固定大小风格，若全部传入，则海报大小是server端下发的实际大小)
      * @param {String} [obj.twoDimensionCodeY] 选填项，二维码的Y坐标
      * @param {String} [obj.twoDimensionCodeW] 选填项，二维码的宽度(方形)
      * @param {String} [obj.twoDimensionCodeColor] 选填项，二维码的颜色(示例 #00ff00)
      * @param {shareCallback} [callback] 选填项，回调函数
      *
      * 
      *     @example
      *     var obj = {
      *          "title": title,
      *          "content":content,
      *          "picPath":picPath,
      *          "url":url,
      *          "logParam":logParam,
      *          "posterPicPath":posterPicPath,
      *          "panelType":panelType,
      *          "shareType":shareType,
      *          "twoDimensionCodeX" : qrX,
      *          "twoDimensionCodeY" : qrY,
      *          "twoDimensionCodeW" : qrW,
      *          "twoDimensionCodeColor" : qrColor
      *     };
      *     function callback(res){
      *     		//TODO
      *     }
      * ZZAPP.setSharePanel(obj,callback);
      */

			}, {
						key: 'setSharePanel',
						value: function setSharePanel(obj, callback) {
									this.validType(obj);
									var arr = ['title', 'content', 'picPath', 'url', 'logParam', 'posterPicPath', 'panelType', 'shareType', 'twoDimensionCodeX', 'twoDimensionCodeY', 'twoDimensionCodeW', 'twoDimensionCodeColor'];
									this.compatInvoke('share', obj, CB.getCallbackName(callback), arr);
						}

						/**
       * @method log
       * @description 日志上报
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.actionType 必填项 上报键
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "actionType": actionType
       *     };
       * ZZAPP.log(obj,callback);
       */

			}, {
						key: 'log',
						value: function log(obj, callback) {
									this.validType(obj);
									var arr = ['actionType'];
									this.compatInvoke('log', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method enterDetail
       * @description 进入商品详情页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.infoId 必填项，商品id
       * @param {String} [obj.from] 选填项，表示源页面:  'youpin'优品M页;'m' 普通M页（专区或活动页）
       * @param {String} [obj.soleId] 选填项，m页的唯一标识id
       * @param {String} [obj.sku] 选填项，优品标识 "sku":"expand=1"（只在进入优品详情页时添加）
       * @param {String} [obj.metric] 选填项，后端统计用字段
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "infoId": infoId,
       *          "from":from,
       *          "soleId":soleId,
       *          "sku":sku,
       *          "metric":metric	
       *     };
       * ZZAPP.enterDetail(obj,callback);
       *     
       */

			}, {
						key: 'enterDetail',
						value: function enterDetail(obj, callback) {
									this.validType(obj);
									var arr = ['infoId', 'soleId', 'sku'];
									this.compatInvoke('enterInfoDetail', obj, CB.getCallbackName(callback), arr);
						}

						/**
       * @method ApplyCustomerService
       * @description 进入客服申请帮助页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.orderId 选填项，订单id
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "orderId": orderId	
       *     };
       * ZZAPP.ApplyCustomerService(obj,callback);
       *     
       */

			}, {
						key: 'ApplyCustomerService',
						value: function ApplyCustomerService(obj, callback) {
									this.validType(obj);
									var arr = ['orderId'];
									this.compatInvoke('enterApplyServiceHelp', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method enterConfirmOrder
       * @description 进入确认订单页加密版
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.infoId 必填项，商品加密id
       * @param {String} [obj.from] 选填项，源页面: 'youpin'优品M页;'m' 普通M页（专区或活动页）
       * @param {String} [obj.soleId] 选填项，m页的唯一标识id
       * @param {String} [obj.metric] 选填项，后端统计用字段
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "infoId": infoId,
       *          "from":from,
       *          "soleId":soleId,
       *          "metric":metric	
       *     };
       * ZZAPP.enterConfirmOrder(obj,callback);
       *     
       */

			}, {
						key: 'enterConfirmOrder',
						value: function enterConfirmOrder(obj, callback) {
									this.validType(obj);
									var arr = ['infoId'];
									this.compatInvoke('enterOrderConfirmSafe', obj, CB.getCallbackName(callback), arr);
						}

						/**
       * @method enterReport
       * @description 进入举报页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.toUid 必填项，被举报用户id
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "toUid": toUid	
       *     };
       * ZZAPP.enterReport(obj,callback);
       *     
       */

			}, {
						key: 'enterReport',
						value: function enterReport(obj, callback) {
									this.validType(obj);
									var arr = ['toUid'];
									this.compatInvoke('complaint', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method enterSearchResult
       * @description 进入搜素结果页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.cityId 必填项，城市id
       * @param {String} obj.cateId 必填项，类别id
       * @param {String} obj.sortType 必填项，排序类型 (“0”:默认排序 “1”:最新发布 “2”:价格最低 “3”:价格最高 “4”:离我最近)
       * @param {String} obj.startPrice 必填项，价格区间下限 (如果无下限传”-1”)
       * @param {String} obj.endPrice 必填项，价格区间上限 (如果无上限传”-1”)
       * @param {String} obj.listType 必填项，列表展示类型 (“0”:单条列表 “1”:瀑布流)
       * @param {String} [obj.serviceIds] 选填项，服务的Ids,多个服务用 竖线 分割
       * @param {String} [obj.keyWorld] 选填项，搜索关键词 (注意: 客户端把键值单词拼错,只能将错就错)
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "cityId": cityId,
       *          "cateId": cateId,
       *          "sortType": sortType,
       *          "startPrice": startPrice,
       *          "endPrice": endPrice,
       *          "listType": listType,
       *          "serviceIds": serviceIds,
       *          "keyWorld" : keyWorld
       *     };
       * ZZAPP.enterSearchResult(obj,callback);
       *     
       */

			}, {
						key: 'enterSearchResult',
						value: function enterSearchResult(obj, callback) {
									this.validType(obj);
									var arr = ['cityId', 'cateId', 'sortType', 'startPrice', 'endPrice', 'listType', 'serviceIds', 'keyWorld'];
									this.compatInvoke('enterSearchResult', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method enterProfile
       * @description 进入个人主页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.userId 必填项，用户id
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "userId": userId	
       *     };
       * ZZAPP.enterProfile(obj,callback);
       *     
       */

			}, {
						key: 'enterProfile',
						value: function enterProfile(obj, callback) {
									this.validType(obj);
									var arr = ['userId'];
									this.compatInvoke('enterHomePage', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method enterHome
       * @description 进入首页
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     ZZAPP.enterHome(obj,callback);
       *     
       */

			}, {
						key: 'enterHome',
						value: function enterHome(callback) {
									this.compatInvoke('enterHome', {}, CB.getCallbackName(callback));
						}
						/**
       * @method enterPublish
       * @description 进入发布页
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     ZZAPP.enterPublish(obj,callback);
       *     
       */

			}, {
						key: 'enterPublish',
						value: function enterPublish(callback) {
									this.compatInvoke('enterPublish', {}, CB.getCallbackName(callback));
						}
						/**
       * @method close
       * @description 关闭当前页
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     ZZAPP.close(obj,callback);
       *     
       */

			}, {
						key: 'close',
						value: function close(callback) {
									this.compatInvoke('close', {}, CB.getCallbackName(callback));
						}
						/**
       * @method enterPage
       * @description 跳转到WEB页
       * @param {Object} obj - 必填项，以json对象形式传参
       * @param {String} obj.targetUrl 跳转到目标url
       * @param {String} [obj.newPageTitle] 目标页面的标题
       * @param {callback} [callback] 选填项，回调函数
       *                         
       *     @example
       *     var obj = {
       *          "targetUrl":targetUrl,	
       *          "newPageTitle":newPageTitle	      	
       *     };
       * ZZAPP.enterPage(obj,callback);
       *     
       */

			}, {
						key: 'enterPage',
						value: function enterPage(obj, callback) {
									this.validType(obj);
									var arr = ['targetUrl', 'newPageTitle'];
									this.compatInvoke('goToTargetURL', obj, CB.getCallbackName(callback), arr);
						}
						/**
       * @method getCookie
       * @description 获取cookie
       * @param {getCookieCallback} callback 回调函数
       *                         
       *     @example
       *     function callback(res){
       *     	   //TODO
       *     }
       * ZZAPP.getCookie(callback);
       *     
       */
						/**
       * 获取cookie的回调
       * @callback getCookieCallback
       * @param {Object} res - 业务层所需参数 json串格式{"code" ：code,"data" : data,"msg":msg}
       * @param {String} res.code - code : 0获取成功 -1获取失败 -100出错信息（业务层的相关状态）
       * @param {String} res.cookie -业务层所需cookie
       * @param {String} res.msg -提示信息
       */

			}, {
						key: 'getCookie',
						value: function getCookie(callback) {
									this.compatInvoke('getCookie', {}, CB.getCookieCallback(callback));
						}
						/**
       * @method  getCoordinate
       * @description 获取客户端经纬度
       * @param {getCoordinateCallback} callback 回调函数
       *                         
       *     @example
       *     function callback(res){
       *     		//TODO
       *     }
       * ZZAPP.getCoordinate(obj,callback);
       *     
       */
						/**
       * 获取经纬度回调
       * @callback getCoordinateCallback
       * @param {Object} res - 业务层所需参数 json串格式{"code" ：code,"data" : data,"msg":msg}
       * @param {String} res.code - code : 0获取成功 -1获取失败 -100出错信息（业务层的相关状态）
       * @param {String} res.lon - 经度 
       * @param {String} res.lat - 纬度 
       * @param {String} res.msg - 提示信息
       */

			}, {
						key: 'getCoordinate',
						value: function getCoordinate(callback) {
									this.compatInvoke('getLonAndLat', {}, CB.getCallbackName(callback));
						}
			}]);
			return ZZJsBridge;
}();

/**
 * @global
 */
var ZZAPP = new ZZJsBridge();

/**
 * 页面异常上报
 * @ignore
 */
window.onerror = function (errorMessage, scriptURL, lineNumber, columnNumber, errorObj) {
  var err = 'sorry,error!\n Message:' + errorMessage + '\nUrl:' + scriptURL + '\nLine:' + lineNumber + '\nColumn:' + columnNumber + '\nObj:' + errorObj;
  console.log(err);
};