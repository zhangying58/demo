function Lginterface() {}
Lginterface.prototype = {
    cookieid: '',
    urlstr: '',
    flag: 0,
    clickLog: function (obj) {
        this.urlstr = 'http://api.lego.wireless.58.com/page/mark?pagetype=ZHUANZHUANM&appid=ZHUANZHUAN&';
        if (typeof obj == "object" || !obj) { //传入参数为object null undefined时
            var idflag = false; //判断是否需要自动补全cookieid的标识
            var actionflag = false; //判断是否需要自动补全actiontype的标识
            for (var key in obj) {
                this.urlstr += key + "=" + obj[key] + "&";
                if (key == "cookieid" && obj[key] != undefined && obj[key] != '') {
                    idflag = true;
                }
                if (key == "actiontype") {
                    actionflag = true;
                }
            }
            if (idflag && actionflag) {
                this.requestLg();
            } else {
                if (!actionflag) {
                    this.urlstr += "actiontype=''&"; //null undefined或者没有传入actiontype时自动补全actiontype的值
                }
                if (!idflag) {
                    this.getCookie('id58'); //null undefined或者没有传入cookieid时查找cookie中的cookieid的值
                }
            }
        } else if (typeof obj == "string") { //传入string时默认为actiontype属性
            this.urlstr += "actiontype=" + obj + "&";
            this.getCookie('id58'); //null undefined或者没有传入cookieid时自动补全cookieid的值
        }
    },
    getCookie: function (cookieName) {
        var id58 = ZZUTIL.cookie.get('id58');
        if (id58) {
            this.urlstr += 'cookieid=' + id58 + '&';
            this.requestLg();
        } else {
            //如果cookie中没有id58，证明是在zhuanzhuan.com的主域名上，则请求下面的接口获得id58并且存储;
            var _this = this;
            $.getJSON('http://zhuanzhuan.58.com/activity/getcookies?t=M&callback=?', function (data) {
                if (!('id58' in data) && _this.flag == 0) {
                    _this.flag++;
                    _this.getCookie('id58');
                    return false;
                }
                if (data.id58 && data.id58 !== null && data.id58 !== undefined) {
                    _this.urlstr += 'cookieid=' + data.id58 + '&';
                    _this.requestLg();
                    var exptime = new Date();
                    exptime.setTime(exptime.getTime() + 3600 * 24 * 30 * 12 * 1000);
                    document.cookie = 'id58=' + data.id58 + ';expires=' + exptime.toGMTString();
                } else {
                    return false;
                }

            })
        }
    },
    requestLg: function () {
        var _this = this;
        $.getJSON(_this.urlstr + "callback=?", function (data) {
            console.log(data);
        });
    }
}
Lginterface.prototype.constructor = Lginterface;
