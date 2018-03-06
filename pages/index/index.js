//index.js
//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
import {care} from '../../utils/util.js'
Page({
  data: {
    time: 10,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    personalInfo: {}
  },
  //事件处理函数
  toSelf() {
    wx.navigateTo({
      url: '../self/self'
    })
  },
  toRank: function () {
    wx.navigateTo({
      url: '../rank/rank'
    })
  },
  toAwaitPk() {

    wsSend('ranking', {
      rankType: 1
    })
    wsReceive('needGold', res => {
      console.log(res)
    })
    wsReceive('waiting', res => {
      console.log(res)
      wx.navigateTo({
        url: '../awaitPK/awaitPK?gold=' + res.data.cost
      })
    })
  },
  toFriPk: function () {
    wx.navigateTo({
      url: '../friendPK/friendPK'
    })

  },
  toZsd() {
    wx.navigateTo({
      url: '../word/word'
    })
  },
  toShop() {
    wx.navigateTo({
      url: '../shopping/shopping'
    })
  },
  onLoad: function () {
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
  onReady() {
    // console.log(app.globalData.personalInfo)


    // care(app.globalData, 'personalInfo', info =>{
    //   this.setData({personalInfo: info})
    // })

// this.setData({
//   personalInfo: app.globalData.personalInfo
// })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '大家一起来拼智力领福利',
      path: '/pages/index/index',

      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function () {
    // wsReceive('cancelSuccess', res => {
    //   console.log(res)
    //   wsReceive('matchSuccess',res=>{
    //     wx.showToast({
    //       title: '您已放弃对战',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   })
    // })
  }
})
