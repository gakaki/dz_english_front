const app = getApp()
const sheet = require('../../sheets.js')
import { getRankFrame } from '../../utils/util.js'
import { doFetch, wsSend, wsReceive, shareSuc, wsClose, checkoutIsRoom } from '../../utils/rest.js';
let time = null
Page({
  data: {
    rid:null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isFirstClick:true,
    rankFrame: '',
    backuserInfo:{},
    stage: [],
    star: 0,
    toView:0,
    season:{},
    rank:0,
    canMatch:true,
    starAnimation:'', //控制星星的动画
    fromIndex:false,  //是否从主页面跳转过来的
    frame:'',//段位头像框
    level: ["https://gengxin.odao.com/update/h5/yingyu/choosePK/xiaoxue.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/chuyi.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/chuer.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/chusan.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/gaoyi.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/gaoer.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/gaosan.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/dayi.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/daer.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/dasan.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/dasi.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/zhuansi.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/zhuanba.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/tuofu.png",
      "https://gengxin.odao.com/update/h5/yingyu/choosePK/yasi.png"]
  },
  onLoad(options) {   
      doFetch('english.getseason',{},res=>{
      this.setData({
        season: sheet.Season.Get(res.data.season)
      })
      wx.setNavigationBarTitle({
        title: this.data.season.cfg.name
      })
    }, () => { }, app)

   

    if (options && options.fromIndex){
      this.data.fromIndex = true
    }
    this.setData({
      isFirstClick:true
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
  onReady() {
    wsReceive('cancelSuccess', res => {
      wsReceive('matchSuccess', res => {
        wx.showToast({
          title: '您已放弃对战',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  onShow() {
    if (this.data.rid) {
      checkoutIsRoom(this.data.rid, false)
    }
    doFetch('english.showpersonal', {}, (res) => {
      this.setData({
        rankFrame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
      })
      //获取用户当前赛季信息
      let season = res.data.userInfo.character.season
      let rankInfo
      for (let key in season) {
        rankInfo = season[key]
      }

      //通过读表获取所有段位相关信息
      let stage;
      stage = sheet.stages.map(o => {
        let obj = {}
        obj['stage'] = new sheet.Stage(o).stage
        obj['jia'] = new sheet.Stage(o).goldcoins2
        obj['jian'] = new sheet.Stage(o).goldcoins1
        obj['star'] = new sheet.Stage(o).star
        return obj
      })

      //是否到达最高等级
      if (rankInfo.rank==15){
        stage.length = rankInfo.rank
        this.setData({
          backuserInfo: res.data.userInfo,
          star: rankInfo.star,
          stage: stage,
          toView: rankInfo.rank - 3,
          rank:15
        })

      }
      else{
        //是否从主页面跳转过来的
        if (this.data.fromIndex) {
          stage.length = rankInfo.rank + 1
          this.setData({
            backuserInfo: res.data.userInfo,
            star: rankInfo.star,
            stage: stage,
            toView: rankInfo.rank - 3
          })
        }
        else {
          this.starAnimation(res, stage, rankInfo)
        }
      }
    }, () => { }, app)
    // 显示段位框
    this.setData({
      frame: getRankFrame(app.globalData.personalInfo.userInfo.character.season)
    })
  },
  starAnimation(res,stage,rankInfo) {
    let changeInfo = app.globalData.pkResult.changeInfo
    //判断是否提升段位
    if (changeInfo.isRank.isRank) {
      //提升段位的时候先执行完加星动画之后在升段位
      stage.length = rankInfo.rank+1
      let oldStage = stage.slice(0, rankInfo.rank)
      this.setData({
        starAnimation: 'increase',
        backuserInfo: res.data.userInfo,
        star: stage[oldStage.length - 2].star,
        stage: oldStage,
        toView: rankInfo.rank - 4
      })
      time = setTimeout(() => {
        this.setData({
          star: rankInfo.star,
          stage: stage,
          toView: rankInfo.rank - 3
        })
      }, 2100)
    }
    else {
      //判断是否加星
      stage.length = rankInfo.rank + 1
      this.setData({
        backuserInfo: res.data.userInfo,
        star: rankInfo.star,
        stage: stage,
        toView: rankInfo.rank - 3
      })
      if (changeInfo.isStarUp.isStarUp == 1) {
        this.setData({
          starAnimation: 'increase',
        })
      }
      else if (changeInfo.isStarUp.isStarUp == -1) {
        this.setData({
          starAnimation: 'decrease',
        })
      }
    }
  },
  
  onUnload() {
    clearTimeout(time)
    wsClose(['cancelSuccess', 'matchSuccess'])
    this.setData({
      isFirstClick: true
    })
  },
  onHide(){
    this.setData({
      isFirstClick: true
    })
  },
  match(v) {
    if (app.preventMoreTap(v)) { return; }
    let type = v.currentTarget.dataset.rank
      doFetch('english.canmatch', 
        { rankType: type},
        res=>{
          if(res.data.inRoom) {
            wx.showToast({
              title: '您已在好友房间中,请先退出', 
              icon: 'none',
              duration: 1000
            })
            return 
          }

          let gold = sheet.Stage.Get(type).goldcoins1
          if (this.data.stage.length > type || this.data.rank == 15) {
            if (this.data.backuserInfo.items[1] >= gold && !res.data.needGold) {
              wx.navigateTo({
                url: '../awaitPK/awaitPK?type=' + type + '&gold=' + gold,
              })
            } else {
              wx.showToast({
                title: '金币不足',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      )
  },
  
  toDes() {
    wx.navigateTo({
      url: '../rankDes/rankDes',
    })
  },
  toSelf(e) {
    if (app.preventMoreTap(e)) { return; }
    wx.navigateTo({
      url: '../self/self'
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
  }
})