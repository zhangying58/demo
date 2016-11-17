
/**
 *CallApp类，代表调起
 *@constructor
 *@method start
 *@method start @param {obj} obj={iosScheme:String(ios调起协议),androidScheme:String(android调起协议),urlSearch:{obj},appStore:String(没有app时Ios相应的跳转地址),androidApk:String(没有app时Ios相应的跳转地址),channelId:Number(对应的渠道包)}
 *@method start @param urlSearch {obj} obj={openType:String}/{opentype:String,id:String/Number}
 *一个参数 openType
 *home(首页)、messagecenter(消息tab页)、mybuy(我买到的)、publish(发布页)
 *两个参数 openType、id
 *detail id(详情页)、mysell id(我卖出的)、order id(订单详情页)、person id(个人主页)、village id(小区页)、web id(M页)
 *write by lihe07
 */
(function(global,factory){
	typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():
	typeof define==='function'&&define.amd?define(factory):
	(global.CallApp=factory());
}(this,function(){
	'use strict';
	/**
	 *调起转转参数
	 */
	var baseParam={
		iosScheme:'zhuanZhuanMStart://',
		androidScheme:'zhuanzhuan://',
		urlSearch:{},
		appStore:'http://zhuanzhuan.58.com/zz/redirect/download',
		androidApk:'http://zhuanzhuan.58.com/zz/redirect/download',
		channelId:923
	};
	/**
	 *判断是否是58APP内置h5。
	 */
	var is58App= function(){
		var paramClient=getSearchParam('client');
		if(paramClient!==null&&paramClient.indexOf('58app')>-1 || typeof WBAPP==='object'){
			return true;
		}else{
			return false;
		}
	};
	/**
	 *缓存浏览器用户代理头
	 */
	var u=window.navigator.userAgent;
	/**
	 *系统判断
	 */
	var deviceType=(function(){
		return {
			mobile:!!u.match(/AppleWebKit.*Mobile.*/),//移动端
			ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
			iPhone:u.indexOf('iPhone')>-1,//iphone
			iPad:u.indexOf('iPad')>-1,//ipad
			android:u.indexOf('Android')>-1//android
		}
	})();
	/**
	 *特殊情况处理(ios9的safari以及ios手机qq的webview)
	 */
	var noSupportIframe=(function(){
		if(deviceType.ios&&u.indexOf('AppleWebKit')>-1&&u.indexOf('Safari')>-1){
			var regIos9=/OS [9]_\d[_\d]* like Mac OS X/i;
			var regIos10=/OS [0-9]{2}_\d[_\d]* like Mac OS X/i;
			var regSafariA=/(.*)AppleWebKit\/(\d*)/;
			var regSafariB=/(.*)Safari\/(\d*)/;
			var regSafari=u.match(regSafariA)[2]==u.match(regSafariB)[2]?true:false;
			if (regIos9.test(u)&&regSafari || regIos10.test(u)&&regSafari) {
				return true;
			}
		}else if(deviceType.ios&&u.indexOf('QQ')>-1&&u.indexOf('UIWebView')>-1){
			return true;
		}
		return false;
	})();
	/**
	 *每次使用调起的参数
	 */
	var newBaseParam={};
	/**
	 *调起app
	 */
	function CallApp(){};
	CallApp.prototype.start=function(){
		var param=arguments[0];
		newBaseParam=mergeParam([baseParam,param]);
		if(!newBaseParam.urlSearch.hasOwnProperty('openType')){
            newBaseParam.urlSearch.openType='home';
        }
		var scheme=null,loadUrl=null;
		if(deviceType.ios){
			scheme=newBaseParam.iosScheme+'?'+serializeJson(newBaseParam.urlSearch);
			loadUrl=newBaseParam.appStore;
			if(u.toLowerCase().indexOf('weibo')>-1){
				sinaWeiBoPop();
				return;
			}
			startApp(scheme,loadUrl,15);
		}else if(deviceType.android){
			scheme=newBaseParam.androidScheme+'?'+serializeJson(newBaseParam.urlSearch)+'&time='+Date.now();
			loadUrl=newBaseParam.androidApk+'?channelId='+newBaseParam.channelId;
			startApp(scheme,loadUrl,100);
		}
		newBaseParam={};	
	};
	function startApp(scheme,loadUrl,time){
		var startTime=Date.now(),endTime=null;
		var hasApp=true;
		var knowHasAppDelayTime=1000,dealHasAppDelayTime=1200;
		if(!noSupportIframe){
			var ifr=createIframe(scheme);
		}else{
			var oA=document.createElement('a');
			oA.setAttribute('href',scheme);
			oA.click();
		}
		/**
		 *判断是否安装app
		 */
		setTimeout(function(){
			endTime=Date.now();
			if(!startTime || endTime-startTime<knowHasAppDelayTime+time){
				hasApp=false;
			}
		},knowHasAppDelayTime);
		/**
		 *移除iframe，未安装app情况下进行下载或跳转处理
		 */
		setTimeout(function(){
			if(!noSupportIframe){
				removeIframe(ifr);
			}
			if(!hasApp){
				if(deviceType.android&&is58App()){
					var WBAppCallzz=function(){
						WBAPP.downloadApp("open","1002355194",loadUrl,"com.wuba.zhuanzhuan","com.wuba.zhuanzhuan.activity.DoPushAndWebStartActivity")
					};
					if(typeof WBAPP==='undefined'){
						append58AppRelyon(WBAppCallzz);
					}else{
						WBAppCallzz();
					}
				}else{
					window.location.href=loadUrl;
				}
			}
		},dealHasAppDelayTime);
	};
	/**
	 *58APP内置h5页面需要依赖的js文件。
	 */
	function append58AppRelyon(callback){
		var oScript=document.createElement('script');
		oScript.setAttribute('src','http://j2.58cdn.com.cn/m58/app58/m_static/js/app.js');
		oScript.setAttribute('id','callappAppend58AppRelyonJs')
		var oHead=document.getElementsByTagName('head')[0];
		oHead.appendChild(oScript);
		oScript.onload = oScript.onreadystatechange = function() {
			if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
			callback();
			oScript.onload = oScript.onreadystatechange = null;
			}
		}
	};
	/**
	 *合并参数
	 */
	function mergeParam(array){
		var newJsonObj={};
		for(var i=0;i<array.length;i++){
			var jsonObj=array[i];
			if(jsonObj instanceof Object){
				for(var key in jsonObj){
					newJsonObj[key]=jsonObj[key];
				}
			}
		};
		return newJsonObj;
	}
	/**
	 *创建iframe
	 */
	function createIframe(scheme){
		var ifr=document.createElement('iframe');
		ifr.setAttribute('src',scheme);
		ifr.style.display='none';
		document.body.appendChild(ifr);
		return ifr;
	};
	/**
	 *移除iframe
	 */
	function removeIframe(ifr){
		document.body.removeChild(ifr);
	};
	/**
	 *序列化json
	 */
	function serializeJson(json){
		var serializeArray=[];
		for(var key in json){
			serializeArray.push(encodeURIComponent(key)+'='+encodeURIComponent(json[key]));
		};
		return serializeArray.join('&');
	};
	/**
	 *获取地址参数
	 */
	function getSearchParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null){
			return decodeURIComponent(r[2]); 
		}else{
			return null;
		}
	};
	/**
	 *微博无法调起，做特殊处理。
	 */
	function sinaWeiBoPop(){
		var oDiv=document.createElement('div');
		oDiv.innerHTML='亲，点击右上角在浏览器中打开就可以下载了哦'
		oDiv.style.height='100%';
		oDiv.style.width='100%';
		oDiv.style.position='fixed';
		oDiv.style.top=0;
		oDiv.style.left=0;
		oDiv.style.backgroundColor='#000';
		oDiv.style.opacity='0.8';
		oDiv.style.color='#fff';
		oDiv.style.fontSize='35px';
		oDiv.style.lineHeight='200px';
		oDiv.style.textAlign='center';
		var oBody=document.body;
		oBody.appendChild(oDiv);
		oDiv.addEventListener('click',function(){
			oBody.removeChild(oDiv);
		})
	};
	/**
	 *暴露方法
	 */
	return CallApp;
}))