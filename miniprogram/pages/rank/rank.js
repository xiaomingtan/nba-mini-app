// miniprogram/pages/rank.js
import teamMap from "../../config/team-map";
import {getLeagueStanding} from "../../api/api";
const STANDINGS_ITEM_HEIGHT = 36;

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperItemHeight: 0,
        teamStandings: null,
        teamAside: ['联盟排行', '西部排行', '东部排行'],
        dataTypeRange: [
            {id: '0', name: '球队榜'},
        ],
        dataTypeIndex: 0,
        standingHeights: []
    },
    fetchTeamStandings() {
        let year = app.globalData.seasonYear
        wx.showLoading()
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
            wx.hideLoading()
        }).catch(e => wx.hideLoading())
    },
    _getHeight(arr) {
        let height = 0;
        arr.forEach(item => {
            height += STANDINGS_ITEM_HEIGHT
        })
        return height + STANDINGS_ITEM_HEIGHT
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let systemInfo = app.globalData.systemInfo// 获取设备信息
        this.setData({'swiperItemHeight': systemInfo.windowHeight})

        this.fetchTeamStandings()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.fetchTeamStandings()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})