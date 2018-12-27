import {getTodayGames, getLeagueStanding, getPlayers} from '../../api/api.js'
import teamMap from '../../config/team-map'
import _ from '../../utils/index'
const WEST_8_AREA = -8 // 西八区

const SWIPER_TOP_HEIGHT = 140
const SWIPER_TAB_HEIGHT = 90

const GET_GAMES_INTERVAL = 30000

const GAME_TAB_INDEX = 0
const PLAYER_TAB_INDEX = 1
const DATA_TAB_INDEX = 2

const STANDINGS_ITEM_HEIGHT = 36

var app = getApp();

Page({
    data: {
        currentTab: GAME_TAB_INDEX,
        swiperItemHeight: 0,
        games: [],
        currentDate: new Date().format('yyyy-MM-dd'),

        // 数据Tab -- data
        teamStandings: null,
        teamAside: ['联盟排行', '西部排行', '东部排行'],
        dataTypeRange: [
            {id: '0', name: '球队榜'},
        ],
        dataTypeIndex: 0,
        standingHeights: [],

        // 球员Tab -- players
        playerPage: 0,
        playerCount: 20, // 每次显示20个
        playerHeaderMap: {},
        allPlayers: [],
        players: [],
        searchKey: ''

    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.timer = setTimeout(() => {
            this.fetchGames()
        }, GET_GAMES_INTERVAL)
        this.fetchGames()
        let systemInfo = app.globalData.systemInfo// 获取设备信息
        let swiperItemHeight = systemInfo.windowHeight - (SWIPER_TOP_HEIGHT * systemInfo.screenWidth / 750) - (SWIPER_TAB_HEIGHT * systemInfo.screenWidth / 750)
        this.setData({'swiperItemHeight': swiperItemHeight})
        this.fetchTeamStandings()
        this.fetchPlayers()
    },
    onPullDownRefresh: function (e) {
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
        if (this.data.currentTab == e.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    // games
    fetchGames: function (refresh) {
        let date = new Date(this.data.currentDate).getLocalTime(WEST_8_AREA).format('yyyy-MM-dd').split('-').join('')
        date = "20181223"
        let hasNotStartedGame = false
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
    // game detail
    toGameDetail:function (e) {
        let gameStr = JSON.stringify(e.detail.game)
        wx.navigateTo({
            url: `/pages/game-detail/game-detail?game=${gameStr}`
        })
    },
    // data
    fetchTeamStandings() {
        let year = new Date().getLocalTime(WEST_8_AREA).getFullYear()
        getLeagueStanding(year).then(data => {
            // console.log(this.data.teamStandings)
            let arr = data.sports_content.standings.team
            let tmp = {}
            // 按胜率排序---从高到低
            arr.sort((a, b) => (parseFloat(b.team_stats.pct.trim()) * 100).toFixed(1) - (parseFloat(a.team_stats.pct.trim()) * 100).toFixed(1))
            tmp.leagueRank = []
            tmp.easternRank = []
            tmp.westernRank = []
            arr.forEach(item => {
                let obj = {
                    logo: teamMap[item.abbreviation.toLowerCase()].logo,
                    name: teamMap[item.abbreviation.toLowerCase()].cn,
                    team_id: item.id,
                    wins: item.team_stats.wins,
                    losses: item.team_stats.losses,
                    pct: (parseFloat(item.team_stats.pct.trim()) * 100).toFixed(1),
                    recent_streak: item.team_stats.streak.indexOf('W') != -1 ? item.team_stats.streak_num + '连胜' : item.team_stats.streak_num.replace('-', '') + '连败',
                }

                tmp.leagueRank.push(obj)

                if (teamMap[item.abbreviation.toLowerCase()].conf === 'eastern') {
                    tmp.easternRank.push(obj)
                } else {
                    tmp.westernRank.push(obj)
                }
            })

            let heights = [0]
            heights.push(this._getHeight(tmp.leagueRank))
            heights.push(heights[heights.length - 1] + this._getHeight(tmp.easternRank))
            heights.push(heights[heights.length - 1] + this._getHeight(tmp.westernRank))
            this.setData({
                teamStandings: tmp,
                standingHeights: heights
            })
        })
    },
    _getHeight(arr) {
        let height = 0;
        arr.forEach(item => {
            height += STANDINGS_ITEM_HEIGHT
        })
        return height + STANDINGS_ITEM_HEIGHT
    },
    // players
    fetchPlayers() { // 获取所有球员
        getPlayers(app.globalData.season, 0).then(data => {
            // console.log(data.resultSets[0])
            let headerMap = {}
            data.resultSets[0].headers.forEach((item, index) => {
                headerMap[item] = index
            })
            let newData = data.resultSets[0].rowSet.sort((a, b) => {
                return parseInt(b[headerMap['TO_YEAR']]) - parseInt(a[headerMap['TO_YEAR']])
            })

            this.setData({
                playerHeaderMap: headerMap,
                allPlayers: newData,
                players: newData.slice(this.data.playerPage * this.data.playerCount, (this.data.playerPage + 1) * this.data.playerCount)
            })
        })
    },
    getMorePlayer(e) {
        let page = e.detail
        this.setData({
            playerPage: page,
            players: this._filterPlayer(this.data.searchKey, page)
        })
    },
    onSearch: _.debounce(function (e) {
        this.setData({
            searchKey: e.detail.value,
            playerPage: 0,
            players: this._filterPlayer(e.detail.value, 0)
        })
    }, 200),
    _filterPlayer(text, page) {
        return text.length ?
            this.data.allPlayers.filter(item => item[this.data.playerHeaderMap['DISPLAY_FIRST_LAST']].toLowerCase().indexOf(text.toLowerCase()) != -1).slice(0, (page + 1) * this.data.playerCount)
            :
            this.data.allPlayers.slice(0, (page + 1) * this.data.playerCount)
    }
})