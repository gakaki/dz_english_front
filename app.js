//app.js
require('./polyfill.js')();
import { start } from 'utils/rest.js';
const sheet = require('sheets.js')
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
    logined: false,
    userInfo: null,
    personalInfo: null ,
    str1: sheet.Share.Get(1).title
  }
})