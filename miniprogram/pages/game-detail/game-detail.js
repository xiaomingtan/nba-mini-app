// miniprogram/pages/game-detail/game-detail.js
import {getGameDetail} from "../../api/api";
import teamMap from '../../config/team-map'
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        game: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getGameDetail(options.id, options.date).then(data => {
            let game = data.sports_content.game
            let newGame = {}
            let homeTeamKey = game.home.team_key.toLowerCase()
            let visitorTeamKey = game.visitor.team_key.toLowerCase()
            newGame.period_time = game.period_time
            newGame.game_status = game.period_time.game_status === app.globalData.GAME_STATUS_NOT_STARTED ?
                'NOT_STARTED' : game.period_time.game_status === app.globalData.GAME_STATUS_STARTING ?
                    'STARTING' : game.period_time.game_status === app.globalData.GAME_STATUS_FINAL ?
                        'FINAL' : ''

            if (newGame.game_status === 'NOT_STARTED') {
                newGame.period_time.period_status = newGame.period_time.period_status.replace('pm', '').replace('ET', '').trim()
                let arr = newGame.period_time.period_status.split(':')
                newGame.period_time.period_status = parseInt(arr[0]) + 1 + ':' + arr[1]
            }

            newGame.home = {
                score: game.home.score,
                team_logo: teamMap[homeTeamKey].logo,
                color: teamMap[homeTeamKey].color,
                cn: teamMap[homeTeamKey].cn,
            }

            newGame.visitor = {
                score: game.visitor.score,
                team_logo: teamMap[visitorTeamKey].logo,
                color: teamMap[visitorTeamKey].color,
                cn: teamMap[visitorTeamKey].cn,
            }

            this.setData({
                game: newGame
            })
            console.log( data.sports_content.game)
        })
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