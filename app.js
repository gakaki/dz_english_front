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
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        wx.reLaunch({
          url: 'index/index',
        })
      }
    })
    // start((res) => {
    //   // console.log('login')
     
    // })
    
  },
  globalData: {
    wsConnect: false,
    fetchIndex: null, //_fetchIntercept里面的idx
    audio:true, //音效开关。默认打开
    logined: false,
    userInfo: null,
    personalInfo: null ,
    str1: sheet.Share.Get(1).desc,
    str2: sheet.Share.Get(2).desc,
    str3: sheet.Share.Get(3).desc,
    str4: sheet.Share.Get(4).desc,
    toFriend: false,
    friendRid: '',
    toRank: false,
    toSelf: false,
    pkResult:{},        //{resultLeft/resultRight: {info:player, score:number, continuousRight:number, final:number//0:失败，1平局 2胜利, changeInfo: isRank: {isRank:isRank,rank:rank},isStarUp: {isStarUp:isStarUp,},isUp: {isUp:isUp,level:level}}
  },
  globalLastTapTime: 0,
  preventMoreTap: function (e) {
    var globaTime = this.globalLastTapTime;
    var time = e.timeStamp;
    if (Math.abs(time - globaTime) < 150 && globaTime != 0) {
      this.globalLastTapTime = time;
      return true;
    } else {
      this.globalLastTapTime = time;
      return false;
    }
  },
  
})