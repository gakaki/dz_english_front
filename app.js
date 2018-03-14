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
    // start((res) => {
    //   // console.log('login')
     
    // })
    
  },
  globalData: {
    logined: false,
    userInfo: null,
    personalInfo: null ,
    str1: sheet.Share.Get(1).title,
    str2: sheet.Share.Get(2).title,
    str3: sheet.Share.Get(3).title,
    str4: sheet.Share.Get(4).title,
    toFriend: false,
    friendRid: '',
    toRank: false,
    toSelf: false,
    pkResult:{},        //{resultLeft/resultRight: {info:player, score:number, continuousRight:number, final:number//0:失败，1平局 2胜利, changeInfo: isRank: {isRank:isRank,rank:rank},isStarUp: {isStarUp:isStarUp,},isUp: {isUp:isUp,level:level}}
  },
  globalLastTapTime: 0,
  preventMoreTap: function (e,t) {
    let finalTime = 500;
    if (t) { finalTime = t}
    var globaTime = this.globalLastTapTime;
    var time = e.timeStamp;
    if (Math.abs(time - globaTime) < finalTime && globaTime != 0) {
      this.globalLastTapTime = time;
      return true;
    } else {
      this.globalLastTapTime = time;
      return false;
    }
  }
})