//index.js
//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js');
import { doFetch, wsSend, wsReceive, start, firstStart, shareSuc } from '../../utils/rest.js';
import { care, getRankFrame } from '../../utils/util.js'
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
    showBtn: true,
    goldCount: 0,
    wid: 0,
    rankFrame: '',
    landing: false,   //是否弹出签到窗口
    landingDay: 0,
    shareIn:false
  },
  //事件处理函数
  hi() {
    this.setData({
      hasUserInfo: true
    })
  },
  toGetInfo(e) {
    if (app.preventMoreTap(e)) { return; }
    start(()=>{
      this.hi()
    })

  },
  toSelf(e) {
    console.log(app)
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../self/self'
      })
    })
  },
  toRank: function (e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../rank/rank'
      })
    })
  },
  toBackpack(e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../backpack/backpack'
      })
    })
  },
  toAwaitPk(e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../choosePk/choosePk?fromIndex=true'
      })
    })
  },
  toFriPk: function (e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../friendPK/friendPK'
      })
    })
  },
  toZsd(e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../word/word'
      })
    })
  },
  toShop(e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      wx.navigateTo({
        url: '../shopping/shopping'
      })
    })
  },
  toSet(e) {
    if (app.preventMoreTap(e)) { return; }
    start(() => {
      this.hi()
      this.setData({
        showSet: true
      })
    })
  },

  //带下划线的为组件抛上来的方法
  _cancelEvent() {
    this.setData({
      showSet: false
    })
  },
  _hide() {
    this.setData({
      landing:false
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
        lvl: v.userInfo.character.level || 0,
        exp: v.userInfo.character.experience.exp || 0,
        goldCount: v.userInfo.items['1'] || 0,
        needExp: v.userInfo.character.experience.needExp || 0,
      })
      if (this.data.exp == 0) {
        this.setData({
          wid: 0
        })
      } else {
        this.setData({
          wid: Math.round(this.data.exp / this.data.needExp * 100)
        })
      }

      //如果是通过分享并且需要跳转时则暂时不显示签到
      // if(!this.data.shareIn){
      //   doFetch('english.isfirstsign', {}, res => {
      //     console.log(res)
      //     this.setData({
      //       landing: res.data.isFirst,
      //       landingDay: res.data.day
      //     })
      //   })
      // }
      
    })
    this.shareTo(options)
    
    firstStart(()=> {
      //如果是通过分享并且需要跳转时则暂时不显示签到
      if(!this.data.shareIn){
        doFetch('english.isfirstsign', {}, res => {
          console.log(res,'isfirst')
          this.setData({
            landing: res.data.isFirst,
            landingDay: res.data.day
          })
        })
      }
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
  shareTo(options) {
    if (options && options.friendPK) {
      this.data.shareIn = true
      if (app.globalData.logined) {
        doFetch('english.roomisexist', {
          rid: options.rid
        }, (res) => {
          if (res.code == 0) {
            if (res.data.roomStatus == 1) {
              wx.navigateTo({
                url: '../friendPK/friendPK?rid=' + options.rid,
              })
            }
            else if (res.data.roomStatus == 2) {
              wx.navigateTo({
                url: '../competition/competition?rid=' + options.rid,
              })
            }
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
      else {
        app.globalData.toFriend = true
        app.globalData.friendRid = options.rid
      }
    }
    else if (options && options.rank) {
      this.data.shareIn = true
      if (app.globalData.logined) {
        wx.navigateTo({
          url: '../rank/rank',
        })
      }
      else {
        app.globalData.toRank = true
      }
    }
    else if (options && options.self) {
      this.data.shareIn = true
      if (app.globalData.logined) {
        wx.navigateTo({
          url: '../self/self',
        })
      }
      else {
        app.globalData.toSelf = true
      }
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
        shareSuc()
      },
      fail: function () {
        // 转发失败
      }
    }
  },
  onShow: function () {
   
    if (app.globalData.logined) {
      doFetch('english.showpersonal', {}, (res) => {
        app.globalData.personalInfo = res.data;
        this.setData({
          rankFrame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
        })
      })
    }
  },
  // getRankFrame(season) {
  //   let idx = 0
  //   for(let i in season) {
  //     idx++
  //   }
  //   if(idx ==1) {
  //     console.log(season[idx].rank)
  //     return ''
  //   }
  //   if(idx >1) {
  //     let i = idx-1
  //     if (parseInt(season[i].rank) <= 6) {
  //       return ''
  //     }else return sheet.Stage.Get(season[i].rank).frame
  //   }
  // }
})
