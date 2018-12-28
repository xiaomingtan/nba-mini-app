// miniprogram/pages/game-detail/game-detail.js
import {getGameDetail} from "../../api/api";
var app = getApp();
const PLAY_ITEM_HEIGHT = 36
Page({

    /**
     * 页面的初始数据
     */
    data: {
        game: null,
        homePlayers: [],
        visitorPlayers: [],
        currentTab: 0,
        playerItemHeights: 0,
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
            console.log(resGame)
            this.setData({
                game: game,
                homePlayers: resGame.home.players.player,
                visitorPlayers: resGame.visitor.players.player,
                playerItemHeights: (resGame.visitor.players.player.length + 1) * PLAY_ITEM_HEIGHT
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