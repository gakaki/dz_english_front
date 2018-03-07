// components/set/set.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    send:'',
    music:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sendOpen() {
      if (wx.getStorageSync('send')){
        this.setData({
          send: 'send-open'
        })
        wx.setStorageSync('send', false);
      }
      else{
        this.setData({
          send: 'send-close'
        })
        wx.setStorageSync('send', true);
      }
      
    },
    musicOpen() {
      if (wx.getStorageSync('music')) {
        this.setData({
          music: 'send-open'
        })
        wx.setStorageSync('music', false);
      }
      else {
        this.setData({
          music: 'send-close'
        })
        wx.setStorageSync('music', true);
      }
    }
  }
})
