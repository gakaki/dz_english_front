// components/set/set.js
const app = getApp()
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
    sendInner:'',
    musicInner:'',
    sendColor:'',
    sendPoa:'',
    musicColor:'',
    musicPoa:''
  },

  attached: function() {
    if (wx.getStorageSync('send')){
      //关闭推送的情况
      this.setData({
        sendColor: 'bg-color',
        sendPoa: 'btn-poa'
      })
    }
    else{

    }

    if (wx.getStorageSync('music')){
      //关闭音效的情况
      this.setData({
        musicColor: 'bg-color',
        musicPoa: 'btn-poa'
      })
      
    }
    else{
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sendOpen() {
      if (wx.getStorageSync('send')){
        this.setData({
          send: 'send-open',
          sendInner: 'send-hide'
        })
        wx.setStorageSync('send', false);
      }
      else{
        this.setData({
          send: 'send-close',
          sendInner: 'send-show'
        })
        wx.setStorageSync('send', true);
      }
      
    },
    musicOpen() {
      if (wx.getStorageSync('music')) {
        this.setData({
          music: 'send-open',
          musicInner: 'send-hide'
        })
        wx.setStorageSync('music', false);
      }
      else {
        this.setData({
          music: 'send-close',
          musicInner: 'send-show'
        })
        wx.setStorageSync('music', true);
      }
    },

    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
  }
})
