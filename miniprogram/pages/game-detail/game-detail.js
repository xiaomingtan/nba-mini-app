// miniprogram/pages/game-detail/game-detail.js
import {getGameDetail} from "../../api/api";
import playerMap from "../../config/player-map"
const PLAY_ITEM_HEIGHT = 36
Page({

    /**
     * 页面的初始数据
     */
    data: {
        game: null,
        homePlayers: [],
        visitorPlayers: [],
        homeLineScores: [
            {period_name: "第一节", score: 0},
            {period_name: "第二节", score: 0},
            {period_name: "第三节", score: 0},
            {period_name: "第四节", score: 0}
        ],
        visitorLineScores: [
            {period_name: "第一节", score: 0},
            {period_name: "第二节", score: 0},
            {period_name: "第三节", score: 0},
            {period_name: "第四节", score: 0}
        ],
        currentTab: 0,
        playerItemHeights: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let game = JSON.parse(options.game)
        this.setData({
            homeLineScores: this._handleLinescores(game.home.linescores),
            visitorLineScores: this._handleLinescores(game.visitor.linescores),
            game: game
        })
        this._fetchGame()
    },
    _fetchGame(refresh) {
        wx.showLoading()
        getGameDetail(this.data.game.id, this.data.game.date).then(data => {
            let resGame = data.sports_content.game
            let game = this.data.game
            game.home.score = resGame.home.score
            game.visitor.score = resGame.visitor.score
            this.setData({
                game: game,
                homePlayers:  this._handlePlayerData(resGame.home.players.player, game.game_status),
                visitorPlayers:this._handlePlayerData(resGame.visitor.players.player, game.game_status),
                playerItemHeights: game.game_status === "NOT_STARTED"? 0 : (resGame.visitor.players.player.length + 2) * PLAY_ITEM_HEIGHT
            })
            wx.hideLoading()
            if (refresh) wx.stopPullDownRefresh();
        }).catch(e => {
            wx.hideLoading()
        })
    },
    _handleLinescores(linescores) {
        if (linescores) {
            if ( linescores.period instanceof Array ) {
                const len = linescores.period.length
                if (linescores.period.length < 4) {
                    for (let i=0; i< len ; i++) {
                        linescores.period.push({
                            period_name: `Q${len + i + 1}`,
                            score: 0
                        })
                    }
                    return linescores.period
                } else {
                    return linescores.period
                }
            } else {
                return [linescores.period]
            }
        } else {
            return [
                {period_name: "Q1", score: 0},
                {period_name: "Q2", score: 0},
                {period_name: "Q3", score: 0},
                {period_name: "Q4", score: 0}
                ]
        }

    },
    _handlePlayerData(arr, status) {
        if (status === "NOT_STARTED") return []
        let total = {
            name: "总计",
            minutes: 0,
            points: 0,
            rebounds_defensive: 0,
            rebounds_offensive: 0,
            assists: 0,
            steals: 0,
            turnovers: 0,
            blocks: 0,
            fouls: 0,
            player_code: 0,
            plus_minus: 0,
            field_goals_made: 0,
            field_goals_attempted: 0,
            three_pointers_made: 0,
            three_pointers_attempted: 0,
            free_throws_made: 0,
            free_throws_attempted: 0,
        }
        let newArr = arr.map(item => {
            for (let key in total) {
                if (key !== "name") {
                    total[key] += isNaN(parseInt(item[key])) ? 0 : parseInt(item[key])
                }
            }
            console.log(item.player_code)
            return Object.assign({
                name: playerMap[item.player_code] ?  playerMap[item.player_code].short : item.last_name,
                rebounds: parseInt(item.rebounds_defensive) + parseInt(item.rebounds_offensive),
                field_goals: item.field_goals_made + '-' + item.field_goals_attempted,
                three_pointers: item.three_pointers_made + '-' + item.three_pointers_attempted,
                free_throws: item.free_throws_made + '-' + item.free_throws_attempted,
            }, item)
        })

        total.rebounds = parseInt(total.rebounds_defensive) + parseInt(total.rebounds_offensive)
        total.field_goals = total.field_goals_made + '-' + total.field_goals_attempted
        total.three_pointers = total.three_pointers_made + '-' + total.three_pointers_attempted
        total.free_throws = total.free_throws_attempted + '-' + total.free_throws_attempted

        newArr.push(total)
        return newArr
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
    onPullDownRefresh: function (e) {
        this._fetchGame(true)
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