/*terminalEvent

方法说明：

    terminalType:
        @des 当前终端类型；
        @value: zz/gj/58/m

    setTitle:
        @des  设置页面title；（zz,58,gj,m,wechat）
        @param {Object} obj - 必填项，以json对象形式传参
        @param {String} [obj.title] 必填项，页面的标题
        @param {callback} [callback] 选填项，回调函数
        @example
          var obj = {
               "title":title,
               "callback":callback
          };
          terminalEvent.setTitle(obj,callback);

     login:
        @des  登录；（zz,gj）
        @param  {loginCallback} [callback] 选填项，回调函数
        @example
         function callback(res){
              	// TODO;
          }
         terminalEvent.login(callback);

     share：
         @des ：右上角的分享；（zz,58,gj,wechat）
         @param {Object} obj - 必填项，以json对象形式传参
         @param {String} obj.title 必填项，分享标题
         @param {String} obj.content 必填项，分享内容
         @param {String} obj.picPath 必填项，分享图片地址
         @param {String} obj.url 必填项，分享跳转地址
         @param {String} [obj.logParam] 选填项，分享成功后要上报的参数(如主题id或好友在卖等活动标识)
         @param {String} [obj.posterPicPath] 选填项，分享海报底图地址
         @param {String} [obj.panelType] 选填项，分享面板类型(allChannel：全渠道， onlyWeixin：只有微信、朋友圈)
         @param {String} [obj.shareType] 选填项，分享类型(common：普通， poster：海报)
         @param {String} [obj.buttonType] 选填项，分享按钮类型(icon：图标，label：文字)
         @param {String} [obj.needLogin] 选填项，点击右侧按钮时是否需要登录 “0”：不需要登录 “1”：需要登录
         @param {String} [obj.twoDimensionCodeX] 选填项，二维码的X坐标(qrX，qrY，qrW三个参数若有一个未传，则海报使用固定大小风格，若全部传入，则海报大小是server端下发的实际大小)
         @param {String} [obj.twoDimensionCodeY] 选填项，二维码的Y坐标
         @param {String} [obj.twoDimensionCodeW] 选填项，二维码的宽度(方形)
         @param {String} [obj.twoDimensionCodeColor] 选填项，二维码的颜色(示例 #00ff00)
         @param {String} [obj.color] 选填项，按钮文案颜色（默认 #FB5329）
         @param {success} [callback] 选填项，分享成功回调函数
         @param {error} [callback] 选填项，分享失败回调函数

 @example
             var obj = {
                  "title" : title,
                  "content" : content,
                  "picPath" : picPath,
                  "url" : url,
                  "logParam" : logParam,
                  "posterPicPath" :　posterPicPath,
                  "panelType" : panelType,
                  "shareType" : shareType,
                  "buttonType" : buttonType,
                  "needLogin" : needLogin,
                  "twoDimensionCodeX" : qrX,
                  "twoDimensionCodeY" : qrY,
                  "twoDimensionCodeW" : qrW,
                  "twoDimensionCodeColor" : qrColor,
                  "color" : color
             }
             function success(res){
             //TODO 分享成功
             }
             function error(res){
             //TODO 分享失败
             }
            terminalEvent.share(obj,success,error);


    shareClick:
         @des :【点击】调起分享面板；（zz,58,gj）
         @param {Object} obj - 必填项，以json对象形式传参
         @param {String} obj.title 必填项，分享标题
         @param {String} obj.content 必填项，分享内容
         @param {String} obj.picPath 必填项，分享图片地址
         @param {String} obj.url 必填项，分享跳转地址
         @param {String} [obj.logParam] 选填项，分享成功后要上报的参数(如主题id或好友在卖等活动标识)
         @param {String} [obj.posterPicPath] 选填项，分享海报底图地址
         @param {String} [obj.panelType] 选填项，分享面板类型(allChannel：全渠道， onlyWeixin：只有微信、朋友
         圈)
         @param {String} [obj.shareType] 选填项，分享类型(common：普通， poster：海报)
         @param {String} [obj.twoDimensionCodeX] 选填项，二维码的X坐标(qrX，qrY，qrW三个参数若有一个未传，则海报使用固定大小风格，若全部传入，则海报大小是server端下发的实际大小)
         @param {String} [obj.twoDimensionCodeY] 选填项，二维码的Y坐标
         @param {String} [obj.twoDimensionCodeW] 选填项，二维码的宽度(方形)
         @param {String} [obj.twoDimensionCodeColor] 选填项，二维码的颜色(示例 #00ff00)
         @param {success} [callback] 选填项，分享成功回调函数
         @param {error} [callback] 选填项，分享失败回调函数
         @example
         var obj = {
              "title": title,
              "content":content,
              "picPath":picPath,
              "url":url,
              "logParam":logParam,
              "posterPicPath":posterPicPath,
              "panelType":panelType,
              "shareType":shareType,
              "twoDimensionCodeX" : qrX,
              "twoDimensionCodeY" : qrY,
              "twoDimensionCodeW" : qrW,
              "twoDimensionCodeColor" : qrColor
         };
         function success(res){
         //TODO 分享成功
         }
         function error(res){
         //TODO 分享失败
         }
        terminalEvent.shareClick(obj,success,error);

    skipToDetail： 
        @des : 跳转详情页面；（zz,58,gj,m,wechat）
        @param {Object} obj - 必填项，以json对象形式传参
        @param {String} [obj.infoId] 必填项，商品id
        @param {String} [obj.ztId]  选填项,跳转主题id
        @param {String} [obj.url]  选填项,跳转url
        @param {String} [obj.title]  选填项,跳转title
        @param {String} [obj.from] 选填项，表示源页面:  'youpin'优品M页;'m' 普通M页（专区或活动页）
        @param {String} [obj.soleId] 选填项，m页的唯一标识id
        @param {String} [obj.sku] 选填项，优品标识 "sku":"expand=1"（只在进入优品详情页时添加）
        @param {String} [obj.metric] 选填项，后端统计用字段
        @param {callback} [callback] 选填项，回调函数
        @example
        var obj = {
             "infoId": infoId,
             "ztId":ztId,
             "title":title,
             "from":from,
             "soleId":soleId,
             "sku":sku,
             "metric":metric
        };
        function callback(){
            //TODO
        }
        terminalEvent.skipToDetail(obj,callback);

    skipToUrl：
        @des : 跳转指定h5页面；（zz,58,gj,m,wechat）
        @param : object={ url:string,    //跳转链接
                         title: string   //跳转标题
                    }
         @example
         var obj = {
         "infoId": infoId,
         "ztId":ztId,
         "title":title,
         "from":from,
         "soleId":soleId,
         "sku":sku,
         "metric":metric
         };
         function callback(){
         //TODO
         }
        terminalEvent.skipToUrl(obj,callback);



    lgLog：
        @des : 乐高统计；（zz,58,gj,m,wechat）
        @param ：object={ actiontype: string,   //一定要大写actiontype
                         param: string          //参数
                    }

    clickLog：
        @des : 终端统计；（58,m)
        @param : object={ pagetype: string,    //一定要大写pagetype
                        actiontype: string,    //一定要大写actiontype
                        fullPath: string,      //全类别
                        param: string          //参数
                        
                    }

参数说明：
    teminal：终端类型（zz 58 gj  m)
    shareMessage：分享的参数;
    setRight:右上角分享配置；
    skipTodetail：跳转 详情页 参数；
    skipTourl：跳转 指定 h5页面 参数；
    logargs：乐高统计参数；
    clickLogArry：统计参数；

外链库地址说明：
    zepto库文件 ：http://XXXX/zepto.js;
    转转App中 : http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/js/lib/zzApp.js；
    赶集App中 : http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/js/lib/GJNative.js；
    58App中 : http://j2.58cdn.com.cn/m58/app58/m_static/js/app.js;（确保在zepto库文件 【后】 引用）
    QQ中 : http://j1.58cdn.com.cn/qqm/js/lib/qqapi.js;（确保在zepto库文件 【后】 引用）
    微信中 ： http://j1.58cdn.com.cn/m58/m3/js/weixin/wxjs-0.0.1.js（确保在zepto库文件 【前】 引用）

*/

;
(function() {
    "use strict";

    // 自主判断终端类型 即环境
    var environment = (function () {
        if (ZZUTIL.platform === 'zz') {
            return 'zz';
        } else if (ZZUTIL.platform === 'app58') {
            return '58';
        } else if (ZZUTIL.platform === 'gj') {
            return 'gj';
        }else{
            return 'm'
        }
    })();

    // 判断是否为 ios 系统
    var isIphone = function() {
        return /(iPhone\sOS)\s([\d_]+)/g.test(navigator.userAgent);
    }();
    

    // 处理分享参数
    var getShareMessage = function(options) {
        return {
            type: options.type || 'top_right', //分享位置 top_right/add_subscription/edit_subscription
            text: options.text || '分享', //分享按钮显示文案
            title: options.title || '标题', //分享标题
            desc: options.desc||options.content || '分享文案', //分享描述
            content: options.desc ||options.content || '分享文案', //分享描述
            shareUrl: options.shareUrl||options.url || '', //分享链接
            url: options.shareUrl||options.url || '', //分享链接
            share_url: options.shareUrl||options.url || '', //分享链接
            imageUrl: options.imageUrl || options.picPath || "http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/css/images/icon-share.jpg", //分享图片链接
            picPath: options.picPath || options.imageUrl || "http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/css/images/icon-share.jpg", //分享图片链接
            image_url: options.imageUrl || options.picPath || "http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/css/images/icon-share.jpg", //分享图片链接
            logParam: options.logParam || "ZZSHARESUCESE", //分享成功后要上报的参数（如主题id或好友在卖等活动标识）
            posterPicPath: options.posterPicPath || "zhuanzhuan", //分享海报底图地址
            panelType: options.panelType || "allChannel", //分享面板类型 （allChannel：全渠道， onlyWeixin：只有微信、朋友 圈） 
            shareType: options.shareType || "common", //分享类型（common：普通， poster：海报） 
            buttonType: options.buttonType || "icon", //分享按钮类型 （icon：图标，label：文字） 
            needLogin: options.needLogin || "0", //点击右侧按钮时是否需要登录 “0”：不需要登录 “1”：需要登录 
            twoDimensionCodeX: options.twoDimensionCodeX, //二维码x坐标  
            twoDimensionCodeY: options.twoDimensionCodeY, //二维码宽
            twoDimensionCodeW: options.twoDimensionCodeW, //二维码宽
            twoDimensionCodeColor: options.twoDimensionCodeColor //二维码颜色 如：字符串“0x000000”
        };
    };

    var teminal = {};

    // 根据环境来判断执行方法
    switch (environment) {
        case 'zz': // 转转环境
            teminal = {

                // 设置页面 title
                setTitle: function(title,callback) {
                    var argstitle = {
                        "title":title
                    };
                    ZZAPP.setTitle(argstitle);

                },

                // 登录
                login: function(callback) {
                    try {
                        callback = callbakc||function(){}
                        if (!ZZUTIL.cookie.get('PPU')) {
                            ZZAPP.login(callback);
                        }
                    } catch (e) {
                        console.log('请检查cookie中是否携带PPU。\n若携带将视为已登录。')
                    }

                },

                // 右上角分享按钮
                share: function(shareMessage,callback) {
                    ZZAPP.setRightShareBtn(shareMessage);

                },

                // 调起分享面板
                shareClick: function(shareMessage, success, error) {
                    ZZAPP.setSharePanel(shareMessage,function(res){
                        if(res.code==0){
                            success();
                        }else if(res.code == -1){
                            error();
                        }else{
                            alert("取消了吧")
                        }
                    })
                },

                // 跳转详情页面
                skipToDetail: function(skipTodetailArry,callback) {
                    ZZAPP.enterDetail(skipTodetailArry,callback);

                },

                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    var obj = {
                        "targetUrl":skipTourl.url,
                        "newPageTitle":skipTourl.title
                    };
                    ZZAPP.enterPage(obj);
                }
            };
            break;
        case '58': // 58app的环境
            teminal = {

                // 设置页面 title
                setTitle: function(title) {
                    WBAPP.setTitle(title);
                },

                // 右上角分享按钮
                share: function(shareMessage, setRight) {
                    var self = this;
                    WBAPP.extendRightBtn(setRight.type, setRight.text, "wubaRightBtnCallback");

                    // 58app接收的函数名
                    window.wubaRightBtnCallback = function() {
                        self.shareClick(shareMessage);
                    }
                },

                // 调起分享面板
                shareClick: function(shareMessage) {
                    WBAPP.shareInfo(shareMessage.title, shareMessage.shareUrl, shareMessage.imageUrl, "", shareMessage.desc, "QQ,SINA,WEIXIN,FRIENDS");
                },

                // 跳转详情页面
                skipToDetail: function(skipTodetail) {
                     if(!skipTodetail.url ){ 
                        skipTodetail.url =  "http://m.zhuanzhuan.58.com/Mzhuanzhuan/zz58app/detail/"+skipTodetail.infoId
                    };
                    WBAPP.loadPage("link", skipTodetail.url, skipTodetail.title, true, true, false);
                },
                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    WBAPP.loadPage("link", skipTourl.url, skipTourl.title, true, true, false);
                },

                // 终端统计
                clickLog: function(clickLogArry) {
                    WBAPP.setWebLog(clickLogArry.actiontype, clickLogArry.pagetype, clickLogArry.fullPath, [clickLogArry.param]);
                }
            };
            break;
        case 'gj': // gjApp的环境
            teminal = {

                // 设置页面 title
                setTitle: function(title) {
                    GJAPP.setTitle(title);
                },

                // 登录
                login: function() {
                    GJAPP.login();
                },

                // 右上角分享按钮
                share: function(shareMessage, setRight) {
                    GJAPP.updateHeaderRightBtn(setRight.text, 'share', shareMessage)
                },

                // 调起分享面板
                shareClick: function(shareMessage) {
                    GJAPP.showShareDialog(shareMessage.title, shareMessage.title, shareMessage.desc, shareMessage.shareUrl, shareMessage.imageUrl);
                },

                // 跳转详情页面
                skipToDetail: function(skipTodetail) {
                    if(!skipTodetail.url ){ 
                        skipTodetail.url = "http://m.zhuanzhuan.58.com/Mzhuanzhuan/listing/ganji/detailApp.html?infoId="+skipTodetail.infoId;
                    }
                    GJAPP.loadPage(skipTodetail.url, skipTodetail.title);
                },

                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    GJAPP.loadPage(skipTourl.url, skipTourl.title);
                }
            };
            break;
        case 'm': // 微信或 m 的环境
            teminal = {

                // 设置页面 title
                setTitle: function(title) {
                    document.title = title;
                    
                    // hack在微信等webview中无法修改document.title的情况
                    var $iframe = $('<iframe style="display: none;" src="http://m.zhuanzhuan.58.com/favicon.ico"></iframe>').on('load error', function() {
                        setTimeout(function() {
                            $iframe.off('load').remove();
                        }, 0)
                    }).appendTo($('body'));
                },

                // 跳转详情页面
                skipToDetail: function(skipTodetail) {
                    skipTodetail.url = "http://m.zhuanzhuan.58.com/Mzhuanzhuan/Mshare/detail.html?infoId=" + skipTodetail.infoId;

                    // 不是微信中的商品跳转详情页地址
                    if(navigator.userAgent.indexOf('MicroMessenger')=='-1'){
                        skipTodetail.url = "http://m.zhuanzhuan.58.com/detail/"+skipTodetail.infoId+"z.shtml?fullCate=5,70149"
                    }
                    location.href = skipTodetail.url;
                },

                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    location.href = skipTourl.url;
                },

                // 右上角分享按钮
                share: function(shareMessage, setRight, success, error) {

                    if(ZZUTIL.platform === 'wechat'){
                        var timeOut = 0;
                        if(!isIphone){
                            timeOut = 400;
                        }
                        setTimeout(function(){
                            try {
                              ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"].forEach(function(item, index) {
                                  wx[item]({
                                      title: shareMessage.title, //分享标题
                                      desc: shareMessage.desc, //分享描述
                                      link: shareMessage.shareUrl, //分享链接
                                      imgUrl: shareMessage.imageUrl, //分享图标
                                      success: function() {
                                          //用户确认分享后执行的回调函数
                                          success && success();
                                      },
                                      cancel: function() {
                                          //用户取消分享后执行的回调函数
                                          error && error();
                                      }
                                  });
                              });
                            } catch (e) {
                                throw ('没有找到微信分享库。\n 确保微信分享库在zepto前面。 ')
                            }
                        },timeOut)
                    }
                    if(ZZUTIL.platform ==='qq'){
                        //QQ分享
                        mqq.ui.setActionButton({title:shareMessage.text,hidden:false}, function(){
                            mqq.data.setShareInfo(shareMessage);
                            mqq.ui.showShareMenu();
                        });

                    }
                },

                // 终端统计
                clickLog: function(clickLogArry) {
                    clickLog('from=' + clickLogArry.actiontype + '&param=' + clickLogArry.param);
                }
            };

            break;

        default:
            console.log('目前支持转转、58、赶集和m的环境');
    };

    // 暴露给用户的方法，参数传递
    var terminalEvent = {

        terminalType:environment,

        // 登录
        login: function(callback) {
            teminal.login(callback);
        },

        // 设置页面title
        setTitle: function(title,callback) {
            teminal.setTitle(title || '标题',callback);
        },

        // 右上角分享按钮和微信分享 可以传递回调
        share: function(options, success, error) {
            var shareMessage = getShareMessage(options);

            // 58、赶集app使用
            var setRight = {
                type: "top_right", // 按钮位置
                text: "分享" // 按钮文案
            };
            setTimeout(function(){
                teminal.share(shareMessage, setRight, success, error);
            }, 800);
        },

        // 调起分享面板
        shareClick: function(options, success, error) {
            var shareMessage = getShareMessage(options);
            teminal.shareClick(shareMessage,success,error);
        },

        // 跳转详情页面
        skipToDetail: function(options,callback) {
            var skipTodetail = {
                infoId: options.infoId || '', //跳转id
                ztId: options.ztId, //跳转主题id
                url: options.url||'', //跳转url(无特定要求不需要传)
                metric:options.metric || '',
                title: options.title || '转转详情页'
            };
            teminal.skipToDetail(skipTodetail,callback);
        },

        // 跳转指定url页面
        skipToUrl: function(options) {
            var skipTourl = {
                url: options.url, //跳转链接
                title: options.title || '标题' //跳转标题
            }
            teminal.skipToUrl(skipTourl);

        },

        // 乐高统计
        lgLog: function(options) {
            try {
                var lgTj = new Lginterface();
                lgTj.clickLog(options);
            } catch (e) {
                console.log('错误' + e + '。\n请确保引入了乐高统计的库。')
            }
        },

        // 终端统计
        clickLog: function(options) {
            var clickLogArry = {
                pagetype: options.pagetype || 'ZHUANZHUANM',
                actiontype: options.actiontype,
                fullPath: options.fullPath || '5', //全类别
                param: options.param || '' //参数
            };
            teminal.clickLog(clickLogArry);
        }
    };

    // 暴露terminalEvent给全局
    window.terminalEvent = terminalEvent;
})();
