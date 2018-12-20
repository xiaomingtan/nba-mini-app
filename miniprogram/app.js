//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }

        this.globalData = {}

        Date.prototype.format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        Date.prototype.getLocalTime = function (i) {
            //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
            if (typeof i !== 'number') return;
            //得到1970年一月一日到现在的秒数
            var len = this.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = this.getTimezoneOffset() * 60000;
            var utcTime = len + offset;
            return new Date(utcTime + 3600000 * i);
        }
    }
})
