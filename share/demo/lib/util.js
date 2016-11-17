/**
 * 转转运营工具库，包括常用的方法的封装
 * 
 * [qs 返回查询字符串信息，用于url中参数的获取]
 * @return {key:value} [所有的参数键值对]
 * @example 
 *     ZZUTIL.qs['type'] === "ZZAPP"
 *     
 * [loadScript 动态载入脚本]
 * @param  {[string]} url [脚本的地址]
 * @param  {[callback]} callback [载入后的回调]
 * @example 
 *     ZZUTIL.loadScript('//img.58cdn.com.cn/zhuanzhuan/mzz/js/lib/bangbangMobilCore.js');  
 *
 * [isZZ 根据ua判断是否是转转端内]
 * @return {boolean} [是转转就返回true]
 *
 * [getRemoteData ajax封装]
 * @param  {[string]}    url     [接口地址]
 * @param  {[{}]}        data    [传入的参数{}]
 * @param  {[callback]}  success [成功的回调函数]
 *
 * [downloadApp 吸底调起黑条]
 * @param  {[{}]} options [传入的配置参数]
 *   deflogo     {base64}    logo图片 base64 默认是转转logo
 *   txt         {string}    展示文案 默认是“这里可以用红包，价更低呦” 
 *   btntxt      {string}    按钮的文案 默认是 “来转转”
 *   bgcolor     {string}    背景色 默认是黑色  #000
 *   fontcolor   {string}    文字颜色，默认白色 #fff
 *   hasclose    {boolean}   是否展示关闭按钮  默认不展示
 *   prevdom     {string}    相邻的dom用于padding-bottom 防止被下载条遮盖  必填
 *   opentype    {string}    "home" "web"  默认home
 *   channelid   {number}    渠道号，默认是923
 *   legolog     {string}    大写 乐高埋点 完全根据传值来进行埋点
 *
 * [diaoqi 调起转转操作]
 * 请引入diaoqi的相关js Mdiaoqizz.js 及 config.js
 * @param {[string]} [opentype] [home|web... 如果是调起到首页不用加参数]
 * @param {[string]} [url] [调起到的url如果是调起到首页不用加参数] 
 * @param {[number]} [channelid] [渠道号  如果是调起到首页不用加参数]
 *
 * [setPicSize 设置图片尺寸，为了向图片服务器请求一定规格大小的图片]
 * @param {String || Array}     picUrl 图片路径，可以为单独的字符串或者是字符串数组
 * @param {Number}              width  请求的宽度
 * @param {Number}              height 请求的高度
 * @param {all}                 watermark [去掉水印 只要有这个参数 即为去掉水印]
 *
 * [hasProtocol 判断URL是否具有 http|https|ftp 协议头]
 * @param {[string]} [url] [url地址]
 * @return {[boolean]} [返回是否具有 http|https|ftp 协议头]
 *
 * [shareClick] 封装了点击分享 微信端
 * @example
 *     ZZUTIL.shareClick("", pageData.shareMessage, "testshareclick");
 * @param {[string]}   [container] [点击的dom节点，如传空字符串或dom节点不存在 则用默认icon替代]
 * @param {[{}]}       [shareMsg]  [分享信息的配置对象]
 * @param {[string]}   [lelog]     [乐高统计埋点，此处接收直接发不会进行端的处理，请处理后再传入]
 * @param {[callback]} [callback]  [分享后的处理]
 * 
 * [cookie cookie的相关操作封装]
 * @method [get]
 * @method [getname]
 * @method [set]
 * @method [remove]
 */
;
(function () {
    var ZZUTIL = ZZUTIL || {

        qs: (function (a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=');
                if (p.length != 2) continue;
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        })(location.search.substr(1).split('&')),

        loadScript: function (url, callback) {
            var script = document.createElement("script")
            script.type = "text/javascript";
            script.onload = function () {
                callback && callback();
            };
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        },

        getRemoteData: function (url, data, success, error) {
            return $.ajax({
                type: "get",
                url: url,
                timeout: 10000,
                data: data,
                cache: false,
                dataType: "jsonp",
                success: success,
                error: error ? error : function (e) {
                    console.log(e);
                }
            });
        },

        downloadApp: function (options) {
            var settings = {
                deflogo: "data:image/png;base64,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",
                txt: "这里可以用红包，价更低呦",
                btntxt: "来转转",
                bgcolor: "000000",
                fontcolor: "ffffff",
                hasclose: false,
                prevdom: '#wrapper',
                legolog: "DOWNLOADAPP"
            };
            $.extend(settings, options);
            var htmldom = {
                "mainstyle": '<style>.downloadapp-hide{display:none;}.downloadapp-padbtm{padding-bottom:3rem;}.downloadapp {height: 3rem;line-height: 3rem;background: #' + settings.bgcolor + ';vertical-align: middle;position: fixed;bottom: 0;left: 0;width: 100%;z-index: 500}.downloadapp img {margin-top: .6rem;margin-left: .4rem;width: 1.8rem;height: 1.8rem;float: left;margin-right: .5rem}.downloadapp span {font-size:.7rem;color: #' + settings.fontcolor + ';float: left}.downloadapp .downloadapp-btn {height: 1.6rem;line-height: 1.6rem;width: auto;padding: 0 .5rem;background: #ff472e;color: #' + settings.fontcolor + ';text-align: center;float: right;font-size: .6rem;margin-top: .7rem;margin-right: .6rem;border-radius: .1rem}</style>',
                "mainbox": '<div class="downloadapp"><img src="' + settings.deflogo + '"><span>' + settings.txt + '</span><div class="downloadapp-btn">' + settings.btntxt + '</div></div>',
                "closestyle": '<style>.downloadapp .downloadapp-btn{margin-right:2rem;}.downloadapp .downloadapp-close{position:absolute;right: -0.6rem;padding: 0 1.2rem;z-index: 1000}.downloadapp .downloadapp-close b{display: inline-block;width:1rem;height: 1px;background: #' + settings.fontcolor + ';font-size: 0;line-height: 0;vertical-align: middle;-webkit-transform: rotate(45deg)}.downloadapp .downloadapp-close b:after {content: ".";display: block;width:1rem;height: 1px;background: #' + settings.fontcolor + ';-webkit-transform: rotate(-90deg)}</style>',
                "closebox": '<div class="downloadapp-close"><b></b></div>'
            };
            !$('.downloadapp').length && $('body').append(htmldom.mainstyle).append(htmldom.mainbox);
            $(settings.prevdom).length && $(settings.prevdom).addClass('downloadapp-padbtm');
            var downloadapp = $('.downloadapp');
            if (settings.hasclose) {
                downloadapp.append(htmldom.closestyle).append(htmldom.closebox);
            }
            downloadapp.on('click', function (e) {
                var currentEle = e.target.className || e.target.parentElement.className;
                e.preventDefault();
                //浮层关闭逻辑
                if (currentEle == 'downloadapp-close') {
                    downloadapp.addClass('downloadapp-hide');
                    $(settings.prevdom).length && $(settings.prevdom).removeClass('downloadapp-padbtm');
                    return;
                }
                ZZUTIL.diaoqi(settings.opentype, settings.diaoqiurl, settings.channelid);
                try {
                    terminalEvent.lgLog({
                        "actiontype": settings.legolog
                    });
                } catch (e) {
                    console.log("请引入新版terminal-event.js");
                }
            });
        },

        diaoqi: function (opentype, url, channelid) {
            try {
                var callapp = new CallApp();
                callapp.start({ urlSearch:  {'openType': opentype, 'id': url}, channelId:channelid});
            } catch (e) {
                console.log("1.确保已经引入callapp.min.js库；2.引入的库必须在zepto库前。");
            };


        },

        setPicSize: function (picUrl, width, height, watermark) {
            var typeofWidth = typeof width;
            var typeofHeight = typeof height;
            if (!picUrl) {
                picUrl = 'http://img.58cdn.com.cn/zhuanzhuan/images/default_head_icon.png';
            } else if ((typeofWidth !== 'string' && typeofWidth !== 'number') || (typeofHeight !== 'string' && typeofWidth !== 'number')) {
                width = 200;
                height = 200;
            }
            var reg = /\.(jpg$|jpeg$|gif$|png$|bmp$|pic$)/i;

            var make = function (url, width, height, watermark) {
                var matchRule = /_\d+_\d+(\.png$|\.jpg$|\.gif$|\.jpeg$|\.bmp$|\.pic$)/i; //匹配路径后边是否是 (xxx_数字_数字.图片拓展名)
                var size = '_' + width + '_' + height;
                var watermark = (watermark != undefined) ? "?watermark=1" : "";
                if (url.indexOf('wx.qlogo.cn') > -1) {
                    _index = url.lastIndexOf('/');
                    _url = url.substr(0, url.lastIndexOf('/')) + '/96';
                    return _url + watermark;
                } else if (matchRule.test(url) && ZZUTIL.hasProtocol(url)) { // 改变已有尺寸
                    var suffix = matchRule.exec(url)[1]; // 获取图片拓展名
                    return url.replace(matchRule, size + suffix) + watermark;
                } else { // 添加新尺寸
                    if (!ZZUTIL.hasProtocol(url)) {
                        var suffix = reg.exec(url)[0];
                        var prefix = url.split(suffix)[0];
                        prefix = 'http://pic' + ZZUTIL.getPicCdn() + '.58cdn.com.cn/zhuanzh/' + prefix;
                        // prefix = 'http://pic' + ZZUTIL.getPicCdn() + '.58cdn.com.cn/' + prefix;
                        return prefix + size + suffix + watermark;
                    } else if (url.indexOf('pic.58') > -1) {
                        var _idx = url.lastIndexOf('.');
                        var _iurl = url.substr(0, _idx);
                        var suffix = reg.exec(url)[0];
                        return _iurl + size + suffix + watermark;
                    } else {
                        return url + watermark;
                    }
                }
            };

            if (picUrl instanceof Array) {
                var newPicArr = [];
                picUrl.map(function (item, index) {
                    if (item == 'null' || item == '' || item == null) {
                        newPicArr.push('http://img.58cdn.com.cn/zhuanzhuan/images/default_head_icon.png');
                    } else {
                        newPicArr.push(make(item, width, height, watermark));
                    }

                });
                if (newPicArr.length > 0) {
                    return newPicArr;
                };
                return false;
            } else if (typeof picUrl == 'string') {
                if (picUrl == 'null' || picUrl == '') {
                    return 'http://img.58cdn.com.cn/zhuanzhuan/images/default_head_icon.png';
                } else {
                    return make(picUrl, width, height, watermark);
                }
                return false;
            }

            return false;
        },

        hasProtocol: function (url) {
            var reg = /^http:\/\/|^https:\/\/|^ftp:\/\//i;
            return reg.test(url);
        },

        // pic1-pic8 图片服务器的随机分配, 分配不成功默认分配 pic4
        getPicCdn: function (uid) {
            if (!uid) {
                return parseInt((Math.random() * 10000) % 8) + 1;
            } else {
                uid = Number(uid);
                if (!uid) {
                    return 4; //uid错误
                }
                return parseInt(uid % 8) + 1;
            }
        },

        // 得到终端类型
        // zz转转 gj赶集 wechat微信 app58 58app qq腾讯qq sinawb新浪微博 txwb腾讯微博
        platform: function () {
            var platform = "m"; // 默认平台
            var ua = navigator.userAgent;
            var regExp = {
                zz: /58ZhuanZhuan$/g,
                gj: /ganji/g,
                wechat: /MicroMessenger/g,
                app58: /58ua="58app"/g,
                qq: /QQ\//g,
                sinawb: /Weibo/g,
                txwb: /TXMicroBlog/g
            }
            for (var key in regExp) {
                if (regExp[key].test(ua)) {
                    return key;
                }
            }
            if (regExp.app58.test(document.cookie)) {
                return 'app58';
            }
            return platform;
        }(),

        shareClick: function (container, shareMsg, legolog, callback) {
            if (!container || !container.length) {
                var shareIcon = '<style>#zzutil-share{width:50px;height:50px;border-radius:25px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAdVBMVEUAAAD/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/RyH/7ej/ORD/9vT/3NT/VTL/g2r/y7//akv/s6P/wrX/Xz7/4tz/mIL/eV3/uqv/08n/q5r/o5D/jHT/clVqLNTRAAAAEnRSTlMAXFFlcAo3kPQjwNAZh7Tkq54GfGMwAAAExElEQVRo3qzS247DIAxF0focc0sgaVH//1tnWgkldOgUku4n3paMfenOmBisxTNrQzTm8tWMCVb4TB6Vtw3fkky0UKU0oqrYeN6JViqh7ZwaIoC10HaIcHicAFK6IhEOERGUgYg4TBiovISX5CWFGTOsVgYeAtXdrsv023K9OeUfSNWOjcFqAqFb5tXnXX6dF0epIA4ME6Qm6Gafm/nZsWYk9H7VnpC0FKHtLEn2TN+XoTLcnD82u0rB0FUBqRCfmATsFNNtADrl7iYFOhUDbobzeSDvNoUwXfsApzzYxN0sXYauebhVOxSr28Z9PpBPwIdLDpvh8sHcpoTm0qUyTivSWj5YkGIcUwpC/LeQlE+V3q/FKMtd+XOILzdGNW+uF+y/3fu9fclE+45jMfBDWxXtNgjDQDWISazVtMV2EiBAKKX//4lLaL2qXcKSh90D+Ckn+3znXA96Aq39L+ZKwSyn50ZKRcdhms/n+dLhnvjiySKlgqBRBB6kzK4sTaSR3GHhBB6jCjQXjAws0kpTFW5vpwBao7WzAOAwvcdV8+pDIY6ZjcwErUYPaYFs7IoJ8eLIU1Woum5pdHjTX5HqMK19dXo2uzjkNnIdyXI9AxiMtHIQT7avD1WZImgAerzXC9CK6XSpDjUbsdCHw5lari2BSziSDcnTKgotDC+vN03cSGrAqFd4XjytMrPLVQEohx6dAup3Mp/nVXPGHzPbcC1s6I1Z/E9pGcWRE79+XF1RZU0LuxkIwLYQfrR1lIj8Sjzu8FvBtFBfVHh4lbqHDTMLkp7X2yO3xEeGGOYMQOMyoK+vU99PzhcpfPDLXhK2e1wSDGAxbBjQfEWZhSObvmaS+EVE2a2TGW5ihAFRa2QGB19IJjlVOy4xrSIC1WvU0ybGlEfBTuH4apK6o1yACMB/2imsbRAjzZFWvvlZrq/IZSLwXVxutiCwnectwRev1w/J529HBMMNYaeUr1iMAnwyyc4GLwRW4hbtAGPaDxk7LFLXXVuADu95TqOTxXj/kwSHEEt3EkPQ/w+J+ibOWpYrBGFou+w2JwFRHldE//8Tey926nRDATs0M66jY5Lz+tFk+/MmuSxwLjfTKn7m/iaFH58yJfmCWz/d+PGFEXYKsAeRDirDh+4e4dIyTgIoYyIAD4jau5fxowAnuxIRPJ/1SF6Adaaus1I6kMzzajyUCRl0BUDfgSyfeiJ9TOfrMwUIxDy4/dTXgNb1XYBgc+2g9fbeBL/XALgppd3VwG8zkVgyV3FMySNDjK4gEq2UiPIAqGQBeRYQ5wpK1EzuKHjBq2wIK4BIFeSulabySSn8RMz0UJCNf6GpfYSbrCAwvxpOqCDcXdJBR4mazjLiK6TDTRG0VIigLjn3wCXnlgo51yNMWZtvNapjhTDtkti0Cux5cRaIKUrsbrOADwB21joP81Q2C/ptjyQAYgQgS9H2uGPg0H6uvSCUDZx7VtS8GaXMcjCXrKjbppp2TleYagPswQFG5wjLdoT5PMRGHxEIjIg2RoQ0I+KmIcHZiAjw/8PMz1FlWnawTDBjTpWz4JsqZ0GfKh9Mk/6I5QsIi7AvX2BkQlu+MPgWYpC1pGSwLo4hcZnP4F6wROTSq6GyiIwKy+EAApSgmlaR68MAAAAASUVORK5CYII=");background-size:100%;position:fixed;z-index:399;bottom:140px;right:10px}</style><div id="zzutil-share"></div>';
                $('body').append(shareIcon);
            }

            container = container || "zzutil-share";
            $("." + container + ",#" + container).on("click", function (e) {
                e.preventDefault();
                shareCtrl(callback);
            });

            function shareCtrl(callback) {
                if (ZZUTIL.platform === 'wechat') {
                    try {
                        $.wxshade();
                    } catch (e) {
                        console.log("请引入最新dialog.js");
                    }
                } else {
                    try {
                        terminalEvent.lgLog({
                            "actiontype": legolog
                        });
                        terminalEvent.shareClick(shareMsg)
                    } catch (e) {
                        console.log("请引入新版terminal-event.js");
                    }
                }
                callback && callback();
            }
        },

        // 提供Native调用传送cookie 并设置 cookie，sessionid 没用
        setCookie4FE: function (sessionid, cookie) {
            var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
            var base64decode = function (str) {
                var c1, c2, c3, c4;
                var i, len, out;
                len = str.length;
                i = 0;
                out = "";
                while (i < len) {
                    /* c1 */
                    do {
                        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    }
                    while (i < len && c1 == -1);
                    if (c1 == -1)
                        break;
                    /* c2 */
                    do {
                        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    }
                    while (i < len && c2 == -1);
                    if (c2 == -1)
                        break;
                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                    /* c3 */
                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if (c3 == 61)
                            return out;
                        c3 = base64DecodeChars[c3];
                    }
                    while (i < len && c3 == -1);
                    if (c3 == -1)
                        break;
                    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                    /* c4 */
                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if (c4 == 61)
                            return out;
                        c4 = base64DecodeChars[c4];
                    }
                    while (i < len && c4 == -1);
                    if (c4 == -1)
                        break;
                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                }
                return out;
            };
            var utf8to16 = function (str) {
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
                            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                            break;
                        case 14:
                            // 1110 xxxx10xx xxxx10xx xxxx
                            char2 = str.charCodeAt(i++);
                            char3 = str.charCodeAt(i++);
                            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                            break;
                    }
                }
                return out;
            };
            cookie = utf8to16(base64decode(cookie));
            var cookieArray = document.cookie.split(';');
            if (cookieArray) {
                for (var i = 0; i < cookieArray.length; i++) {
                    var key = cookieArray[i].split('=')[0];
                    if (key.indexOf('id58') < 0) {
                        document.cookie = key + '=0;domain=58.com; path=/; expires=' + new Date(0).toUTCString();
                    }
                }
            }
            if (cookie != '') {
                var cookieArr = cookie.split(';');
                var dd = new Date();
                var uid = '';
                dd.setTime(dd.getTime() + 3600 * 24 * 1000);
                if (cookie.indexOf('PPU') > -1) {
                    uid = cookie.split('PPU=')[1].split(';')[0].split('UID=')[1].split('&')[0];
                    document.cookie = 'uid=' + uid + ';domain=58.com; path=/; expires=' + dd.toGMTString();
                }
                cookieArr.map(function (item) {
                    if (!!item) {
                        document.cookie = item + ';domain=58.com; path=/; expires=' + dd.toGMTString();
                    }
                });
            }
        },

        // cookie的操作
        cookie: {
            get: function (name, encode) {
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                var j = 0;
                while (i < clen) {
                    j = i + alen;
                    if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j, encode);
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) break
                }
                return null
            },
            getname: function (cookie_name, name) {
                var cookie_val = this.get(cookie_name);
                var regex = new RegExp("[?&]" + encodeURIComponent(name) + "\\=([^&#]+)");
                var value = (cookie_val.match(regex) || ["", ""])[1];
                return decodeURIComponent(value)
            },
            set: function (name, value, expires, path, domain, secure) {
                var argv = arguments;
                var argc = arguments.length;
                var now = new Date;
                var expires = argc > 2 ? argv[2] : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate());
                var path = argc > 3 ? argv[3] : "/";
                var domain = argc > 4 ? argv[4] : ".58.com";
                var secure = argc > 5 ? argv[5] : false;
                document.cookie = name + "=" + escape(value) + (expires == null ? "" : "; expires=" + expires.toGMTString()) + (path == null ? "" : "; path=" + path) + (domain == null ? "" : "; domain=" + domain) + (secure == true ? "; secure" : "")
            },
            remove: function (name) {
                if (this.get(name)) this.set(name, "", new Date(1970, 1, 1))
            },
            getCookieVal: function (offset, encode) {
                var endstr = document.cookie.indexOf(";", offset);
                if (endstr == -1) {
                    endstr = document.cookie.length
                }
                if (encode == false) return document.cookie.substring(offset, endstr);
                else return unescape(document.cookie.substring(offset, endstr))
            }
        }
    };

    window.ZZUTIL = ZZUTIL;

    // 暴露给Native调用
    window.setCookie4FE = ZZUTIL.setCookie4FE;
})();
