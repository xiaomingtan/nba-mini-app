// components/player-list/player-list.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
      addGlobalClass: true
  },
  // header: [PERSON_ID, DISPLAY_LAST_COMMA_FIRST, DISPLAY_FIRST_LAST, FROM_YEAR,
  // TO_YEAR, PLAYERCODE, TEAM_ID, TEAM_CITY, TEAM_NAME, TEAM_ABBREVIATION, TEAM_CODE, GAMES_PLAYED_FLAG]
  properties: {
      players: {
          type: Array,
          default: []
      },
      headerMap: {
          type: Object,
          default: {}
      },
      page: {
          type: Number,
          default: 0
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      loadMore(e) {
          this.triggerEvent('next', this.properties.page + 1)
      },
      onTab(e) {
          let player = e.currentTarget.dataset.player
          this.triggerEvent('to-player', {player})
      }
  }
})
