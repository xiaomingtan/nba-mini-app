import {getTodayGames, getLeagueStanding, getPlayers} from '../../api/api.js'
import teamMap from '../../config/team-map'
const WEST_8_AREA = -8 // 西八区

const SWIPER_TOP_HEIGHT = 140
const GET_GAMES_INTERVAL = 30000

const GAME_TAB_INDEX = 0

var app = getApp();

Page({
    data: {
        currentTab: GAME_TAB_INDEX,
        swiperItemHeight: 0,
        games: [],
        currentDate: new Date().format('yyyy-MM-dd')
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.timer = setTimeout(() => {
            this.fetchGames()
        }, GET_GAMES_INTERVAL)
        this.fetchGames()
        let systemInfo = app.globalData.systemInfo// 获取设备信息
        let swiperItemHeight = systemInfo.windowHeight - (SWIPER_TOP_HEIGHT * systemInfo.screenWidth / 750)
        this.setData({'swiperItemHeight': swiperItemHeight})
    },
    onPullDownRefresh: function (e) {
        this.fetchGames(true)
    },
    // games
    fetchGames: function (refresh) {
        let date = new Date(this.data.currentDate).getLocalTime(WEST_8_AREA).format('yyyy-MM-dd').split('-').join('')
        // date = "20190103"
        let hasNotStartedGame = false
        wx.showLoading()
        getTodayGames(date).then(data => {
            console.log(data.sports_content.games.game)
            let newData = []
            data.sports_content.games.game.forEach(item => {
                let tmp = {}
                let homeTeamKey = item.home.team_key.toLowerCase()
                let visitorTeamKey = item.visitor.team_key.toLowerCase()
                tmp.period_time = item.period_time
                tmp.game_status = item.period_time.game_status === app.globalData.GAME_STATUS_NOT_STARTED ?
                    'NOT_STARTED' : item.period_time.game_status === app.globalData.GAME_STATUS_STARTING ?
                        'STARTING' : item.period_time.game_status === app.globalData.GAME_STATUS_FINAL ?
                            'FINAL' : ''
                tmp.id = item.id
                tmp.date = item.date
                if (tmp.game_status === 'NOT_STARTED') {
                    tmp.period_time.period_status = tmp.period_time.period_status.replace('pm', '').replace('ET', '').trim()
                    let arr = tmp.period_time.period_status.split(':')
                    tmp.period_time.period_status = parseInt(arr[0]) + 1 + ':' + arr[1]
                    hasNotStartedGame = true
                }
                tmp.home = {
                    score: item.home.score,
                    team_logo: teamMap[homeTeamKey].logo,
                    color: teamMap[homeTeamKey].color,
                    cn: teamMap[homeTeamKey].cn,
                    linescores: item.home.linescores
                }
                tmp.visitor = {
                    score: item.visitor.score,
                    team_logo: teamMap[visitorTeamKey].logo,
                    color: teamMap[visitorTeamKey].color,
                    cn: teamMap[visitorTeamKey].cn,
                    linescores: item.visitor.linescores
                }
                newData.push(tmp)
            })

            if (!hasNotStartedGame) clearInterval(this.timer)
            if (refresh) wx.stopPullDownRefresh();
            wx.hideLoading()
            this.setData({'games': newData})
        }).catch(e => {
            wx.hideLoading()
        })
    },
    // game detail
    toGameDetail:function (e) {
        let gameStr = JSON.stringify(e.detail.game)
        wx.navigateTo({
            url: `/pages/game-detail/game-detail?game=${gameStr}`
        })
    }
})