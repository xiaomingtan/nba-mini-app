// components/player-data/player-data.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      data: {
          type: Array,
          default: []
      },
      teamColor: {
          type: String,
          default: ''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      headers: [
          {label: "时间", key: "minutes"},
          {label: "得分", key: "points"},
          {label: "篮板", key: "rebounds_defensive"},
          {label: "助攻", key: "assists"},
          {label: "抢断", key: "steals"},
          {label: "盖帽", key: "blocks"},
          {label: "盖帽", key: "blocks"},
          {label: "盖帽", key: "blocks"},
          {label: "盖帽", key: "blocks"},
      ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
