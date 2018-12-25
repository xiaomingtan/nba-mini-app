import address from './address.js'

export function getTodayGames(date) {
  const url = address.gameGeneral(date)
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: url,
      dataType: 'json',
      success: function(response) {
        if (response.statusCode === 200 || response.statusCode === 204) {
          resolve(response.data)
        } else {
          resolve(response.errMsg)
        }
      },
      fail: function(e) {
          reject(e)
      }
    })
  })
}

export function getGameDetail(id, date) {
    const url = address.gameDetail(date, id)
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'GET',
            url: url,
            dataType: 'json',
            success: function(response) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    resolve(response.data)
                } else {
                    resolve(response.errMsg)
                }
            },
            fail: function(e) {
                reject(e)
            }
        })
    })
}

export function getLeagueStanding(year) {
    const url = address.leagueStanding(year)
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'GET',
            url: url,
            dataType: 'json',
            success: function(response) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    resolve(response.data)
                } else {
                    resolve(response.errMsg)
                }
            },
            fail: function(e) {
                reject(e)
            }
        })
    })
}

export function getPlayers(season, IsOnlyCurrentSeason) {
    const url = address.playerList(season, IsOnlyCurrentSeason)
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'GET',
            url: url,
            dataType: 'json',
            success: function(response) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    resolve(response.data)
                } else {
                    resolve(response.errMsg)
                }
            },
            fail: function(e) {
                reject(e)
            }
        })
    })
}