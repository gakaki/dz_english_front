// components/pop/pop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '金宝箱'
    },
    lv: {
      type: String,
      value: '5'
    },
    num: {
      type: String,
      value: '1'
    },
    iconName: {
      type: String,
      value: ''
    },
    show: {
      type: Boolean,
      value: false
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
    hidePop:function(){
      this.setData({
        show: false
      })
    }
  }
})
