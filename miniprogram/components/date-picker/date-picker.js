// components/date-picker/date-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentDate: {
        type: String,
        default: ''
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
      bindDateChange: function(e) {
          this.triggerEvent('get-date', e.detail.value)
      }
  }
})
