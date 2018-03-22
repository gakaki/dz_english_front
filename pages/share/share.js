const app = getApp()
const sheet = require('../../sheets.js')
import { stages } from '../../sheets.js'
import { doFetch, shareSuc } from '../../utils/rest.js';
import { getRankFrame } from '../../utils/util.js'
Page({
  data: {
    ava: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info: {},
    jiyilv: 0,
    shenglv: 0,
    segment: '',
    comment: '',
    rankFrame: '',
    newWordsPercent: 0,
    shareGold: 0
  },
  onLoad: function () {

    doFetch('english.showpersonal', {}, (res) => {
      this.setData({
        rankFrame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
      })
      let tempCount = res.data.newWord.totalWordCount
      let tempArr = sheet.Commentss.map(o => {
        return o.newterminology
      })
      let tempIdx = 0
      let id
      for (let i = tempArr.length; i--; i > 0) {
        if (tempArr[i] >= tempCount) {
          tempIdx = tempArr[i]
          id = i + 1
        }
      }
      this.setData({
        comment: sheet.Comments.Get(id).description
      })
      let rank = res.data.userInfo.character.season['1'].rank
      let tc = res.data.remember.totalCount
      let temp = 0
      if (tc == 0) {
        temp = 0
      }
      else {
        temp = parseInt((res.data.remember.rightCount / res.data.remember.totalCount) * 100)
      }
      let tempSl = 0
      if (res.data.userInfo.character.total == 0) {
        tempSl = 0
      } else {
        tempSl = parseInt((res.data.userInfo.character.wins / res.data.userInfo.character.total) * 100)
      }

      this.setData({
        info: res.data,
        newWordsPercent: (res.data.newWord.totalWordCount != 0) ? parseInt(((res.data.newWord.newWordCount) / (res.data.newWord.totalWordCount)) * 100) : 0,
        jiyilv: temp,
        shenglv: tempSl,
        segment: sheet.Stage.Get(rank).stage
      })

      doFetch('english.canshare', {}, res => {
        if (res.data.canShare) {
          this.setData({
            shareGold: res.data.num
          })
        } else {
          this.setData({
            shareGold: 0
          })
        }
      }, () => { }, app)

    }, () => { }, app)

    if (app.globalData.userInfo) {
      this.setData({
        ava: app.globalData.userInfo.avatarUrl,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          ava: res.userInfo.avatarUrl,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            ava: res.userInfo.avatarUrl,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      ava: e.detail.userInfo.avatarUrl,
      hasUserInfo: true
    })
  },
  toMatch() {
    wx.reLaunch({
      url: '../index/index?choosePk=true'
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str5,
      path: '/pages/index/index',
      success: function () {
        shareSuc()
      },
      fail: function () {
        // 转发失败
      }
    }
  }
})