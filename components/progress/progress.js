// components/progress/progress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStart: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 10,
    timer: 0
  },
  attached: function () {
    let that = this
    
    this.setData({
      timer: setInterval(function() {
        that.setData({
          num: that.data.num-1
        })
        if(that.data.num <= 0) {
         clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
