// miniprogram/pages/player-detail/player-detail.js
import {getPlayerInfo} from "../../api/api";
import playerMap from "../../config/player-map"
import teamMap from "../../config/team-map"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        player: null
    },
    _fetchPlayer(id) {
        getPlayerInfo(id).then(data => {
            let playerInfoData = data.resultSets[0]
            let playerStatsData = data.resultSets[1]
            let playerHeaderMap = {}
            let statsHeaderMap = {}
            playerInfoData.headers.forEach((item, index) => {
                playerHeaderMap[item] = index
            })
            playerStatsData.headers.forEach((item, index) => {
                statsHeaderMap[item] = index
            })

            let row = playerInfoData.rowSet[0]
            let player = {
                id: row[playerHeaderMap["PERSON_ID"]],
                name: playerMap[row[playerHeaderMap["PLAYERCODE"]]] ?
                    playerMap[row[playerHeaderMap["PLAYERCODE"]]].full :
                    row[playerHeaderMap["DISPLAY_FIRST_LAST"]],
                team: row[playerHeaderMap["TEAM_ABBREVIATION"]] ? teamMap[row[playerHeaderMap["TEAM_ABBREVIATION"]].toLowerCase()] : null,
                jersey: row[playerHeaderMap["JERSEY"]],
                avatar: row[playerHeaderMap["TEAM_ID"]] ?
                    `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/${row[playerHeaderMap["TEAM_ID"]]}/${row[playerHeaderMap["TO_YEAR"]]}/260x190/${row[playerHeaderMap["PERSON_ID"]]}.png` :
                    `https://stats.nba.com/media/players/230x185/${row[playerHeaderMap["PERSON_ID"]]}.png`
            }

            this.setData({
                player: player
            })

            console.log(player)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let player = JSON.parse(options.player)
        console.log(player)
        this._fetchPlayer(player.id)
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