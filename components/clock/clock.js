// components/clock/clock.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clockStart: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { 
        this.setData({
          num: 10
        })
        if (newVal) {
          this.setData({
            timer: setInterval(() => {
              this.setData({
                num: this.data.num - 1
              })
              if (this.data.num == 0) {
                this.setData({
                  clockStart: false
                })
              }
              if (this.data.num < 0) {
                clearInterval(this.data.timer)
              }
            }, 1000)
          })
        } else {
          clearInterval(this.data.timer)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 10,
    timer: 0
  },
  
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
