// miniprogram/pages/player.js
import _ from '../../utils/index'
import {getPlayers} from "../../api/api";

const SWIPER_TOP_HEIGHT = 140;

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperItemHeight: 0,
        playerPage: 0,
        playerCount: 20, // 每次显示20个
        playerHeaderMap: {},
        allPlayers: [],
        players: [],
        searchKey: ''
    },
    fetchPlayers() { // 获取所有球员
        wx.showLoading()
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
            wx.hideLoading()
        }).catch(e => {
            wx.hideLoading()
        })
    },
    toPlayerDetail:function (e) {
        let player = e.detail.player
        console.log(player)
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
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let systemInfo = app.globalData.systemInfo// 获取设备信息
        let swiperItemHeight = systemInfo.windowHeight - (SWIPER_TOP_HEIGHT * systemInfo.screenWidth / 750)
        this.setData({'swiperItemHeight': swiperItemHeight})
        this.fetchPlayers()
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