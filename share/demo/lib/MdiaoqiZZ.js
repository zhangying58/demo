 //需要引用http://img.58cdn.com.cn/zhuanzhuan/pcWebsite/js/config.js 来确定andriod的下载链接 websiteConf.url_android,versionConf.android

 function MdiaoqiZZ() {}
 MdiaoqiZZ.prototype = {
     hasApp: true,
     URLdata: {},
     init: function (openType, id, channelid) {
         var __this = this,
             url;
         url = "zhuanzhuan://?openType=" + (openType || "home");
         id && (url += "&id=" + id);
         if (window.navigator.userAgent.toLowerCase().indexOf('weibo') > -1) {
             var _height = $(window).height();
             if ($('.tkBG').length > 0) {
                 $('.tkBG').remove();
             }
             $('body').append('<div class="tkBG"></div>');
             $('.tkBG').css({
                 'background': '#000000',
                 'opacity': '0.7',
                 'filter': 'alpha(opacity=70)',
                 'width': '100%',
                 'position': 'absolute',
                 'left': 0,
                 'height': _height + "px",
                 'top': $(window).scrollTop() + "px",
                 'z-index': 9999,
                 'display': 'block'
             });
             if ($('.weixincontent').length < 1) {
                 $('body').append('<div class="weixincontent"><img src="http://img.58cdn.com.cn/zhuanzhuanftp/mzz/images/double11/browserTip.png"></div>');
                 $(".weixincontent").css({
                     'position': 'absolute',
                     'left': 0,
                     'top': $(window).scrollTop() + "px",
                     'z-index': 10000
                 });
                 $(".weixincontent img").css({
                     'width': '100%',
                     'height': 'auto'
                 });
             }
             $('.tkBG').on('click', function () {
                 $('.tkBG').remove();
                 $(".weixincontent").remove();
             })
             return;
         } else {
             var ua = window.navigator.userAgent.toLowerCase();
             if (ua.match(/iphone/g)) {
                 this.downIOS(openType, id);
                 setTimeout(function () {
                     if (!__this.hasApp) {
                         window.location.href = "itms-apps://itunes.apple.com/cn/app/id1002355194";
                     }
                 }, 1100);
             } else {
                if (typeof (GJAPP) !== "undefined") {
                     GJAPP.openOutApp(url, "com.wuba.zhuanzhuan", websiteConf.url_android);
                 } else {
                     this.downAndriod(openType, id);
                     setTimeout(function () {
                         __this.getUserData();
                         if (!__this.hasApp) {
                             if (!channelid || channelid == '') {
                                 if ('zhuanzhuanSourceFrom' in URLdata && URLdata.zhuanzhuanSourceFrom != '') {
                                     var _channelid = parseInt(URLdata.zhuanzhuanSourceFrom, 10);
                                     if (!isNaN(_channelid)) {
                                         channelid = _channelid;
                                     } else {
                                         channelid = 923;
                                     }
                                 } else if ('from' in URLdata && URLdata.from != '') {
                                     var _channelid = parseInt(URLdata.from, 10);
                                     if (!isNaN(_channelid)) {
                                         channelid = _channelid;
                                     } else {
                                         channelid = 923;
                                     }
                                 } else {
                                     channelid = 923;
                                 }
                             }
                             window.location.href = "http://dl.58cdn.com.cn/zhuanzhuan/android/" + versionConf.android + "/zhuanzhuan_market_" + channelid + ".apk";
                         }
                     }, 1100);
                 }
             }
         }


     },
     downIOS: function (openType, id) {
         var timeout, t1;
         var ifr = document.createElement("iframe");
         if (Boolean(navigator.userAgent.match(/OS (9|10)_\d[_\d]* like Mac OS X/i))) {
             t1 = Date.now();
             window.location.href = "zhuanZhuanMStart://?openType=" + openType + "&id=" + id
         } else {
             if (openType == undefined && id == undefined) {
                 t1 = Date.now();
                 ifr.setAttribute("src", "zhuanZhuanMStart://?time=" + t1);
             } else if (openType != undefined && id == undefined) {
                 t1 = Date.now();
                 ifr.setAttribute("src", "zhuanZhuanMStart://?openType=" + openType + "&time=" + t1);
             } else {
                 t1 = Date.now();
                 ifr.setAttribute("src", "zhuanZhuanMStart://?openType=" + openType + "&id=" + id + "&time=" + t1)
             }
             ifr.setAttribute("style", "display:none");
             document.body.appendChild(ifr)
         }
         var _this = this;
         timeout = setTimeout(function () {
             _this.try_to_open_app(t1);
         }, 500);
         return false
     },
     downAndriod: function (openType, id) {
         var timeout, t1;

         var ifr = document.createElement("iframe");
         ifr.setAttribute("style", "display:none");
         if (openType == undefined && id == undefined) {
             t1 = Date.now();
             ifr.setAttribute("src", "zhuanzhuan://?time=" + t1);
         } else if (openType != undefined && id == undefined) {
             t1 = Date.now();
             ifr.setAttribute("src", "zhuanzhuan://?openType=" + openType + "&time=" + t1);
         } else {
             t1 = Date.now();
             ifr.setAttribute("src", "zhuanzhuan://?openType=" + openType + "&id=" + id + "&time=" + t1);
         }
         document.body.appendChild(ifr);
         var _this = this;
         timeout = setTimeout(function () {
             _this.try_to_open_app(t1);
         }, 500);
         return false
     },
     try_to_open_app: function (t1) {
         var t2 = Date.now();
         if (!t1 || t2 - t1 < 800) {
             this.hasApp = false;
         }
     },
     getUserData: function () {
         var userData = decodeURIComponent(location.search).replace("?", "");
         var userData_arry = userData.split("&");
         if (userData_arry.length > 0) {
             for (var i = 0; i < userData_arry.length; i++) {
                 var Varry = userData_arry[i].split("=");
                 this.URLdata[Varry[0]] = Varry[1];
             }
         }
         return this.URLdata;
     }
 };
 MdiaoqiZZ.prototype.constructor = MdiaoqiZZ;
