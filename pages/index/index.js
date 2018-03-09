//index.js
//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js');
import { doFetch, wsSend, wsReceive, start } from '../../utils/rest.js';
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
    showSet: false,
    showBtn: true
  },
  //事件处理函数
  hi() {
    this.setData({
      hasUserInfo: true
    })
  },
  toGetInfo() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
    }
  },
  toSelf() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../self/self'
      })
    }
  },
  toRank: function () {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../rank/rank'
      })
    }
  },
  toBackpack() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../backpack/backpack'
      })
    }
  },
  toAwaitPk() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../choosePk/choosePk',
      })
    }
  },
  toFriPk: function () {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../friendPK/friendPK'
      })
    }
  },
  toZsd() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../word/word'
      })
    }
  },
  toShop() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      wx.navigateTo({
        url: '../shopping/shopping'
      })
    }
  },
  toSet() {
    if (!app.globalData.hasUserInfo) {
      wx.openSetting({
        success: (res) => {
          start((res) => {
          })
        }
      })
    } else {
      this.hi()
      this.setData({
        showSet: true
      })
    }

  },

  //带下划线的为组件抛上来的方法
  _cancelEvent() {
    this.setData({
      showSet: false
    })
  },
  getInfo() {
    wx.openSetting({
      success: (res) => {

      }
    })
  },
  onLoad: function (options) {
    care(app.globalData, 'personalInfo', v => {
      console.log(v)
      this.setData({
        lvl: v.userInfo.character.level,
        exp: v.userInfo.character.experience.exp,
        needExp: v.userInfo.character.experience.needExp
      })
    })

    if (options && options.friendPK) {
      doFetch('english.roomNotExist', {
        rid: options.rid
      }, (res) => {
        if (res.code == 0) {
          wx.navigateTo({
            url: '../friendPK/friendPK?rid='+options.rid,
          })
        }
        else {
          wx.showToast({
            title: '房间不存在',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

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
      title: app.globalData.str4,
      path: '/pages/index/index',
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/share.png',
      success: function () {

      },
      fail: function () {
        // 转发失败
      }
    }
  },
  onShow: function () {
    console.log(this.data.showBtn)
    if (app.globalData.logined) {
      doFetch('english.showpersonal', {}, (res) => {
        app.globalData.personalInfo = res.data;
      })
    }
  }
})
