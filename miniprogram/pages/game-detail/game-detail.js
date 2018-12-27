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
        let game = JSON.parse(options.game)
        this.setData({
            game: game
        })
        this._fetchGame()
    },
    _fetchGame() {
        getGameDetail(this.data.game.id, this.data.game.date).then(data => {
            let resGame = data.sports_content.game
            let game = this.data.game

            game.home.score = resGame.home.score
            game.visitor.score = resGame.visitor.score
            console.log(game)
            console.log(resGame)
            this.setData({
                game: game
            })
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