import {getTodayGames} from '../../api/api.js'
import teamMap from '../../config/team-map'

const GAME_STATUS_NOT_STARTED = '1' // 比赛未开始
const GAME_STATUS_STARTING = '2' // 比赛进行中
const GAME_STATUS_FINAL = '3' // 比赛结束

const WEST_8_AREA = -8 // 西八区

Page({
    data: {
        currentTab: 0,
        swiperItemHeight: 0,
        games: [],
        currentDate: new Date().format('yyyy-MM-dd')
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.timer = setTimeout(() => {
            this.fetchGames()
        }, 30000)
        this.fetchGames()
        let systemInfo = wx.getSystemInfoSync() // 获取设备信息
        let swiperItemHeight = systemInfo.windowHeight * systemInfo.pixelRatio - 270
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
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    fetchGames: function () {
        let date = new Date(this.data.currentDate).getLocalTime(WEST_8_AREA).format('yyyy-MM-dd').split('-').join('')
        let hasNotStartedGame = false
        getTodayGames(date).then(data => {
            console.log(data.sports_content.games.game)
            let newData = []
            data.sports_content.games.game.forEach(item => {
                let tmp = {}
                let homeTeamKey = item.home.team_key.toLowerCase()
                let visitorTeamKey = item.visitor.team_key.toLowerCase()
                tmp.period_time = item.period_time
                tmp.game_status = item.period_time.game_status === GAME_STATUS_NOT_STARTED ?
                    'NOT_STARTED' : item.period_time.game_status === GAME_STATUS_STARTING ?
                    'STARTING': item.period_time.game_status === GAME_STATUS_FINAL ?
                    'FINAL' : ''

                if ( tmp.game_status === 'NOT_STARTED') {
                    tmp.period_time.period_status = tmp.period_time.period_status.replace('pm', '').replace('ET', '').trim()
                    let arr =  tmp.period_time.period_status.split(':')
                    tmp.period_time.period_status = parseInt(arr[0]) + 1 + ':' + arr[1]
                    hasNotStartedGame = true
                }
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

            if (!hasNotStartedGame) clearInterval(this.timer)

            this.setData({'games': newData})
        })
    },
    getCurrentDate: function (e) {
        this.setData({
            currentDate: e.detail
        })
        this.fetchGames()
    }

})