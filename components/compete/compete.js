// components/compete/compete.js
import { getRankImg } from '../../utils/util.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    clockStart:{
      value:false,
      type:Boolean
    },
    clockTime: {
      type: Number,
      value: null
    },
    userLeft: {
      type:Object,
      value:null,
      observer: function (v) {
        if (v && v.lastRank) {
          this.setData({
            userLeftImg: getRankImg(v.lastRank)
          })
        }
      }
    },
    userRight: {
      type:Object,
      value: null,
      observer: function (v) {
        if (v && v.lastRank) {
          this.setData({
            userRightImg: getRankImg(v.lastRank)
          })
        }
        
      }
    },
    showMask: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userLeftImg:'',
    userRightImg:''
  },
  attached(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    setTimeout(()=>{
      this.triggerEvent('mcStopped');
    },1000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
