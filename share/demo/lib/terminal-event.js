/*terminalEvent

方法说明：

    terminalType:
        @des:当前终端类型；
        @value: zz/gj/58/m

    setTitle:
        @des : 设置页面title；（zz,58,gj,m,wechat）
        @param ：{string} 页面title 

    login：
        @des : 登录；
        @param : 无

    share：
        @des ：右上角的分享；（zz,58,gj,wechat）参数值带 * 为必填项
        @param ：object={ type：* string,        //分享位置 top_right/add_subscription/edit_subscription
                         text：* string,         //分享按钮显示文案
                         title:* string,         //分享标题
                         desc:* string,          //分享描述
                         shareUrl:* string,      //分享链接，
                         imageUrl:* string,      //分享图片链接
                         logParam:* string,      //分享成功后要上报的参数（如主题id或好友在卖等活动标识）
                         posterPicPath:* string, //分享海报底图地址 
                         panelType:* string,     //分享面板类型 （allChannel：全渠道，  onlyWeixin：只有微信、朋友圈）
                         shareType:* string,     //分享类型（common：普通， poster：海报） 
                         buttonType:* string,    //分享按钮类型 （icon：图标，label：文字） 
                         needLogin:* string,     //点击右侧按钮时是否需要登录 “0”：不需要登录 ,“1”：需要登录 
                         twoDimensionCodeX:string,     //二维码x坐标
                         twoDimensionCodeY:string,     //二维码y坐标
                         twoDimensionCodeW:string,     //二维码宽
                         twoDimensionCodeColor:string  //二维码颜色 如：字符串“0x000000”
                    }

    shareClick:
        @des :【点击】调起分享面板；（zz,58,gj）参数值带 * 为必填项
        @param ：object={ title:* string,         //分享标题
                         desc:* string,          //分享描述
                         shareUrl:* string,      //分享链接，
                         imageUrl:* string,      //分享图片链接
                         logParam:* string,      //分享成功后要上报的参数（如主题id或好友在卖等活动标识）
                         posterPicPath:* string, //分享海报底图地址 
                         panelType:* string,     //分享面板类型 （allChannel：全渠道，  onlyWeixin：只有微信、朋友圈）
                         shareType:* string,     //分享类型（common：普通， poster：海报） 
                         buttonType:* string,    //分享按钮类型 （icon：图标，label：文字） 
                         needLogin:* string,     //点击右侧按钮时是否需要登录 “0”：不需要登录 ,“1”：需要登录 
                         twoDimensionCodeX:string,     //二维码x坐标
                         twoDimensionCodeY:string,     //二维码y坐标
                         twoDimensionCodeW:string,     //二维码宽
                         twoDimensionCodeColor:string  //二维码颜色 如：字符串“0x000000”
                    }

    skipToDetail： 
        @des : 跳转详情页面；（zz,58,gj,m,wechat）
        @param : object={ infoId: string,    //跳转id
                         ztId: string,       //跳转主题id
                         url: string,        //跳转url
                         title: string      //跳转title
                    }

    skipToUrl：
        @des : 跳转指定h5页面；（zz,58,gj,m,wechat）
        @param : object={ url:string,    //跳转链接
                         title: string   //跳转标题
                    }

    skipToOrder：
        @des : 跳转到订单页面；（zz）
        @param : object={infoId: srting  //跳转id }

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
    skipToorder：跳转 订单页面；
    logargs：乐高统计参数；
    clickLogArry：统计参数；

外链库地址说明：
    zepto库文件 ：http://XXXX/zepto.js;
    转转App中 : http://img.58cdn.com.cn/zhuanzhuan/mzz/js/lib/bangbangMobilCore.js；
    赶集App中 : http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/js/lib/GJNative.js；
    58App中 : http://j2.58cdn.com.cn/m58/app58/m_static/js/app.js;（确保在zepto库文件 【后】 引用）
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
        } else {
            return 'm';
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
            desc: options.desc || '分享文案', //分享描述
            shareUrl: options.shareUrl || '', //分享链接
            imageUrl: options.imageUrl || "http://img.58cdn.com.cn/zhuanzhuan/zzactivity/ZZActivityUI/css/images/icon-share.jpg", //分享图片链接
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
                setTitle: function(title) {
                    var argstitle = isIphone ? [title, ""] : [title];
                    setTimeout(function() {
                        _BB.invokeMethod('setNativeTitle', argstitle);
                    }, 500);
                },

                // 登录
                login: function() {
                    try {
                        if (!ZZUTIL.cookie.get('PPU')) {
                            isIphone ? _BB.login() : _BB.invokeMethod('login');
                        }
                    } catch (e) {
                        console.log('请检查cookie中是否携带PPU。\n若携带将视为已登录。')
                    }

                },

                // 右上角分享按钮
                share: function(shareMessage) {
                    if (isIphone) {
                        var argsShare = [shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam, shareMessage.posterPicPath, shareMessage.panelType, shareMessage.shareType, shareMessage.needLogin];
                        _BB.invokeMethod('setRightShareButton', argsShare);
                    } else {
                        var argsShare = [shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam, shareMessage.posterPicPath, shareMessage.panelType, shareMessage.shareType, shareMessage.buttonType, shareMessage.needLogin];
                        _BB.invokeMethod('setRightShareButton', argsShare);
                    }
                },

                // 调起分享面板
                shareClick: function(shareMessage) {
                    var argsShare = [];
                    if (isIphone) {
                        _BB.share(shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam, shareMessage.posterPicPath, shareMessage.panelType, shareMessage.shareType)
                    } else {
                        if (shareMessage.twoDimensionCodeColor) {
                            argsShare = [shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam, shareMessage.posterPicPath, shareMessage.panelType, shareMessage.shareType, shareMessage.twoDimensionCodeX, shareMessage.twoDimensionCodeY, shareMessage.twoDimensionCodeW, shareMessage.twoDimensionCodeColor];
                        } else {
                            if (shareMessage.shareType) {
                                argsShare = [shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam, shareMessage.posterPicPath, shareMessage.panelType, shareMessage.shareType];
                            } else {
                                argsShare = [shareMessage.title, shareMessage.desc, shareMessage.imageUrl, shareMessage.shareUrl, shareMessage.logParam];
                            }
                        }
                        _BB.invokeMethod('share', argsShare);
                    };
                },

                // 跳转详情页面
                skipToDetail: function(skipTodetail) {
                    var argsTourl = [skipTodetail.infoId];
                    skipTodetail.ztId && argsTourl.push(skipTodetail.ztId);
                    _BB.invokeMethod('enterInfoDetail', argsTourl);
                },

                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    var argsTourl = [skipTourl.url, skipTourl.title];
                    _BB.invokeMethod('goToTargetURL', argsTourl);
                },

                // 跳转订单页面
                skipToOrder: function(skipTodetail) {
                    var argsTourl = [skipTodetail.infoId];
                    _BB.invokeMethod('enterOrderConfirm', argsTourl);
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
                        skipTodetail.url =  "http://m.zhuanzhuan.58.com/Mzhuanzhuan/listing/detailApp.html?infoId="+skipTodetail.infoId
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
                    if(!skipTodetail.url ){
                        skipTodetail.url = "http://m.zhuanzhuan.58.com/Mzhuanzhuan/Mshare/detail.html?infoId=" + skipTodetail.infoId;
                        
                        // 不是微信中的商品跳转详情页地址
                        if(navigator.userAgent.indexOf('MicroMessenger')=='-1'){
                            skipTodetail.url = "http://m.zhuanzhuan.58.com/detail/"+skipTodetail.infoId+"z.shtml?fullCate=5,70149"
                        }
                    };
                    location.href = skipTodetail.url;
                },

                // 跳转指定url页面
                skipToUrl: function(skipTourl) {
                    location.href = skipTourl.url;
                },

                // 右上角分享按钮
                share: function(shareMessage, setRight, success, error) {
                    if(ZZUTIL.platform === 'wechat'){
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
        login: function() {
            teminal.login();
        },

        // 设置页面title
        setTitle: function(title) {
            teminal.setTitle(title || '标题');
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
            }, 600);
        },

        // 调起分享面板
        shareClick: function(options) {
            var shareMessage = getShareMessage(options);
            teminal.shareClick(shareMessage);
        },

        // 跳转详情页面
        skipToDetail: function(options) {
            var skipTodetail = {
                infoId: options.infoId || '', //跳转id
                ztId: options.ztId, //跳转主题id
                url: options.url||'', //跳转url
                title: options.title || '转转详情页'
            };
            teminal.skipToDetail(skipTodetail);
        },

        // 跳转指定url页面
        skipToUrl: function(options) {
            var skipTourl = {
                url: options.url, //跳转链接
                title: options.title || '标题' //跳转标题
            }
            teminal.skipToUrl(skipTourl);

        },

        // 跳转订单页面
        skipToOrder: function(options) {
            var skipToorder = {
                infoId: options.infoId || '' //跳转id 
            }
            teminal.skipToOrder(skipToorder);
        },

        // 乐高统计
        lgLog: function(options) {
            var logargs = {
                "actiontype": options.actiontype,
                "channelid": options.param
            };

            try {
                var lgTj = new Lginterface();
                lgTj.clickLog(logargs);
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
