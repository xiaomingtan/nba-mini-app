import {getTodayGames} from '../../api/api.js'
import teamMap from '../../config/team-map'

Page({
    data: {
        currentTab: 0,
        swiperItemHeight: 0,
        games: [],
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.fetchGames('20181218')
        this.timer = setInterval( () => {
            this.fetchGames('20181218')
        }, 30000)
        let systemInfo = wx.getSystemInfoSync()
        let swiperItemHeight = systemInfo.windowHeight * systemInfo.pixelRatio - 90
        this.setData({'swiperItemHeight': swiperItemHeight})
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function (e) {
        var that = this;
        if ( e.target.dataset.current !== 0) {
            clearInterval(this.timer)
        } else {
            this.fetchGames('20181218')
            this.timer = setInterval( () => {
                this.fetchGames('20181218')
            }, 30000)
        }
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    fetchGames: function (date) {
        getTodayGames(date).then(data => {
            console.log(data.sports_content.games.game)
            let newData = []
            data.sports_content.games.game.forEach(item => {
                let tmp = {}
                let homeTeamKey = item.home.team_key.toLowerCase()
                let visitorTeamKey = item.visitor.team_key.toLowerCase()
                tmp.period_time = item.period_time
                tmp.home = {
                    score: item.home.score,
                    team_logo: teamMap[homeTeamKey].logo,
                    color: teamMap[homeTeamKey].color,
                    cn: teamMap[homeTeamKey].cn,
                }
                tmp.visitor = {
                    score: item.visitor.score,
                    team_logo: teamMap[visitorTeamKey].logo,
                    color: teamMap[visitorTeamKey].color,
                    cn: teamMap[visitorTeamKey].cn,
                }
                newData.push(tmp)
            })
            this.setData({'games': newData})
        })
    }
})