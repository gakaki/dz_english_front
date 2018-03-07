//index.js
//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js');
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
import { care } from '../../utils/util.js'
Page({
  data: {
    time: 10,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lvl: 0,
    exp: 0,
    needExp: 0,
    showSet: false

  },
  //事件处理函数
  toSelf() {
    wx.navigateTo({
       url: '../self/self'
     // url: '../choosePk/choosePk'
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
      wx.showToast({
        title: '金币不足',
        icon: 'none',
        duration: 2000
      })
    })
    wsReceive('waiting', res => {
      console.log(res)
      wx.navigateTo({
        url: '../awaitPK/awaitPK?gold=' + res.data.cost
      })
    })
  },
  toFriPk: function () {
    console.log('creatroom')
    wsSend('createroom')
    wsReceive('createSuccess', res => {
      console.log(res)
      wx.navigateTo({
        url: '../friendPK/friendPK?rid='+res.data.rid
      })
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
  toSet() {
    console.log(this.set)
    this.setData({
      showSet: true
    })
  },

  //带下划线的为组件抛上来的方法
  _cancelEvent() {
    this.setData({
      showSet: false
    })
  },
  
  onLoad: function (options) {
    console.log(options)
    care(app.globalData, 'personalInfo', v => {
      console.log(v)
      this.setData({
        lvl: v.userInfo.character.level,
        exp: v.userInfo.character.experience.exp,
        needExp: v.userInfo.character.experience.needExp
      })
    })

    // let aa = {bb:'bb'};

    // Object.defineProperty(aa, 'cc', {
    //   get:()=> {
    //     return 5;
    //   },
    //   set:(v) => {
    //     console.log('call old set of cc')
    //     this.value =v;
    //   },
    //   configurable:true
    // })

    // care(aa, 'bb', v=> {
    //   console.log('bb changed,now is ',v)
    // });

    // care(aa, 'cc', v => {
    //   console.log('cc changed now is', v)
    // })

    // setTimeout(()=> {
    //   // aa.bb = 'ccccc'
    //   aa.cc = '222222'
    // }, 1000)


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

    if (options.friendPK) {
      setTimeout(() => {
        wx.navigateTo({
          url: '../friendPK/friendPK?rid=' + options.rid,
        })
      }, 1000)
    }

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
    if (app.globalData.logined) {
      doFetch('english.showpersonal', {}, (res) => {
        app.globalData.personalInfo = res.data;
        console.log(777)
      })
    }
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
