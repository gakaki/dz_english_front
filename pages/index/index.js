//index.js
//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js');
import { doFetch, start, firstStart, shareSuc, wsClosed } from '../../utils/rest.js';
import { care, getRankFrame } from '../../utils/util.js';
let map = [];
Page({
  data: {
    time: 10,
    nn: '',
    ava: '',
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
    shareIn:false,
    canUp: false
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
      this.hi();
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
    if(options.ownerLeave) {
      wx.showToast({
        title: '房主已离开'
      })
    }
    
    care(app.globalData, 'personalInfo', v => {
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
      this.setData({
        rankFrame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
      })
    })
    this.shareTo(options)
    firstStart(()=> {
      //如果是通过分享并且需要跳转时则暂时不显示签到
      if(!this.data.shareIn){
        doFetch('english.isfirstsign', {}, res => {
          this.setData({
            landing: res.data.isFirst,
            landingDay: res.data.day
          })
          this.isRedPoint()
        }, () => { }, app)
      }
    })


    if (app.globalData.userInfo) {
      this.setData({
        ava: app.globalData.userInfo.avatarUrl,
        nn: app.globalData.userInfo.nickName,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          ava: res.userInfo.avatarUrl,
          nn: res.userInfo.nickName,
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
            nn: res.userInfo.nickName,
            hasUserInfo: true
          })
        }
      })
    }
   

  },
  loginedShare(options){
    setTimeout(()=>{
      doFetch('english.roomisexist', {
        rid: options.rid
      }, (res) => {
        console.log(res,'好友PK')
        let rid = options.rid;
        if (res.code == 0) {
          if (res.data && res.data.roomStatus == 1) {
            wx.navigateTo({
              url: '../friendPK/friendPK?rid=' + rid,
            })
          }
          else if (res.data && res.data.roomStatus == 2) {
            wx.navigateTo({
              url: '../competition/competition?rid=' + options.rid + '&a=' + res.data.roomStatus,
            })
          }
        }
        else {
          wx.showToast({
            title: '房主离开房间',
            icon: 'none',
            duration: 2000
          })
        }
      }, () => { }, app)
    },500)
  },
  shareTo(options) {
    if (options && options.friendPK) {
      this.data.shareIn = true
      if (app.globalData.logined) {
        this.loginedShare(options);
      }
      else {
        app.globalData.toFriend = true
        app.globalData.friendRid = options.rid
        setTimeout(()=>{
          this.loginedShare(options);
        },2000)
        
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
      ava: e.detail.userInfo.avatarUrl,
      nn: e.detail.userInfo.nickName,
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
  isRedPoint() {
    doFetch('english.develop', {}, (res) => {
      for (let k in res.data) {
        if (res.data[k].canUp) {
          this.setData({
            canUp: true
          })
          return
        }else {
          this.setData({
            canUp: false
          })
        }
      }
    }, () => { }, app)
  },
  onShow: function () {
    if (app.globalData.logined) {
      doFetch('english.showpersonal', {}, (res) => {
        app.globalData.personalInfo = res.data;
        this.setData({
          rankFrame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
        })
      }, () => { }, app)
      this.isRedPoint()
    }
    if (app.globalData.wsConnect){
      wsClosed() 
    }

  }
})
