import {getTodayGames} from '../../api/api.js'
import teamMap from '../../config/team-map'

const GAME_STATUS_NOT_STARTED = '1' // 比赛未开始
const GAME_STATUS_STARTING = '2' // 比赛进行中
const GAME_STATUS_FINAL = '3' // 比赛结束

const WEST_8_AREA = -8 // 西八区

const SWIPER_TOP_HEIGHT = 180
const SWIPER_TAB_HEIGHT = 90

const GET_GAMES_INTERVAL = 30000

Page({
    data: {
        currentTab: 0,
        swiperItemHeight: 0,
        games: [],
        currentDate: new Date().format('yyyy-MM-dd'),
        areaRange: [
            {id: '0', name: '全部'},
            {id: 'western', name: '西部'},
            {id: 'eastern', name: '东部'}
        ],
        areaIndex: 0
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.timer = setTimeout(() => {
            this.fetchGames()
        }, GET_GAMES_INTERVAL)
        this.fetchGames()
        let systemInfo = wx.getSystemInfoSync() // 获取设备信息
        let swiperItemHeight = systemInfo.windowHeight - (SWIPER_TOP_HEIGHT * systemInfo.screenWidth / 750) - (SWIPER_TAB_HEIGHT * systemInfo.screenWidth / 750)
        this.setData({'swiperItemHeight': swiperItemHeight})
    },
    onPullDownRefresh: function(e) {
        this.fetchGames(true)
    },
    //滑动切换
    swiperTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function (e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    fetchGames: function (refresh) {
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
                        'STARTING' : item.period_time.game_status === GAME_STATUS_FINAL ?
                            'FINAL' : ''

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
            if (refresh) wx.stopPullDownRefresh();
            this.setData({'games': newData})
        })
    },
    getCurrentDate: function (e) {
        this.setData({
            currentDate: e.detail
        })
        this.fetchGames()
    },
    bindAreaChange: function (e) {
        console.log(e)
        this.setData({
            areaIndex: parseInt(e.detail.value)
        })
    }

})