const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info: {},
    jiyilv: 0,
    shenglv: 0,
    segment: '',
    sentenceEn: '',
    sentenceCn: ''
  },
  onLoad: function () {

    doFetch('english.showpersonal', {}, (res) => {
      let rank = res.data.userInfo.character.season['1'].rank
      let tc = res.data.remember.totalCount
      let temp = 0
      if(tc == 0) {
        temp = 0
      }
      else {
        temp = parseInt((res.data.remember.rightCount / res.data.remember.totalCount)*100)
      }
      let tempSl = 0
      if (res.data.userInfo.character.total == 0) {
        tempSl = 0
      }else {
        tempSl = parseInt((res.data.userInfo.character.wins / res.data.userInfo.character.total) * 100)
      }
      let idx = res.data.userInfo.character.cumulativeDays
        this.setData({
          info: res.data,
          sentenceCn: sheet.Landingessay.Get(idx+1).Chinese,
          sentenceEn: sheet.Landingessay.Get(idx + 1).English,
          jiyilv: temp,
          shenglv: tempSl,
          segment: sheet.Stage.Get(rank).stage
        })
    })

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
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})