// components/clock/clock.js

// components/progress/progress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clockStart: {
      type: Boolean,
      value: true,
      observer:function(a) {
      }
    },
    clockTime:{
      type: Number,
      value: 10, 
      observer: function (a) {
      }
    }
  }

})
