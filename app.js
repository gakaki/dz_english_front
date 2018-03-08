//app.js
require('./polyfill.js')();
import { start } from 'utils/rest.js';
App({
  onLaunch: function () {
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType == 'none') {
        wx.showLoading({
          title: '当前网络不可用'
        })
      } else {
        wx.hideLoading()
      }
    })
    start((res) => {
      // console.log('login')
     
    })
    
  },
  globalData: {
    userInfo: null,
    personalInfo: null 
  }
})