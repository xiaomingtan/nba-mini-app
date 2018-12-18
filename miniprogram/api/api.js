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
        resolve(e)
      }
    })
  })
}