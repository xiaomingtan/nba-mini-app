// components/data-list/data-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      aside: {
          type: Array,
          default: []
      },
      standings: {
          type: Object,
          default: null
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentAsideIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
