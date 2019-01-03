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

        this.globalData = {
            GAME_STATUS_NOT_STARTED : '1', // 比赛未开始
            GAME_STATUS_STARTING : '2', // 比赛进行中
            GAME_STATUS_FINAL : '3', // 比赛结束
            systemInfo: wx.getSystemInfoSync(), // 获取设备信息
            season: '2018-19',
            seasonYear: "2018"
        }


        // format date to yyyy-mm-dd hh:mm:ss
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

        /**
         *
         * @param i: 时区值数字
         * @example 北京为东八区则输进8,西5输入-5
         * @returns {Date}
         */
        Date.prototype.getLocalTime = function (i) {
            if (typeof i !== 'number') return;
            let len = this.getTime();  // 得到1970年一月一日到现在的秒数
            let offset = this.getTimezoneOffset() * 60 * 1000; // 本地时间与GMT时间的时间偏移差(ms)
            let utcTime = len + offset;
            return new Date(utcTime + 60 * 60 * 1000 * i);
        }
    }
})
