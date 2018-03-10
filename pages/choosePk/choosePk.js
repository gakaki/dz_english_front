const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
let time = null
Page({
  data: {
    userInfo:{},
    stage: [],
    star: 0,
    toView:0,
    season:{},
    canMatch:true,
    starAnimation:'', //控制星星的动画
    fromIndex:false,  //是否从主页面跳转过来的
    navBack:false,    //是否从其它页面点击返回返回来的
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
    })
    if (options && options.fromIndex){
      this.data.fromIndex = true
    }
  },
  onReady() {
    wsReceive('cancelSuccess', res => {
      console.log(res)
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
    doFetch('english.showpersonal', {}, (res) => {
      console.log(res, 'season')

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

      //是否从结果页面跳转过来的
      if (this.data.fromIndex) {
        //是否从结果页面点击返回回来的
        if (this.data.navBack) {
          this.starAnimation(res,stage,rankInfo)
        }
        else {
          stage.length = rankInfo.rank + 1
          this.setData({
            userInfo: res.data.userInfo,
            star: rankInfo.star,
            stage: stage,
            toView: rankInfo.rank - 3
          })
        }
      }
      else {
        this.starAnimation(res,stage,rankInfo)
      }
    })
  },
  starAnimation(res,stage,rankInfo) {
    console.log(1111, app.globalData.pkResult.changeInfo)
    let changeInfo = app.globalData.pkResult.changeInfo
    //判断是否提升段位
    if (changeInfo.isRank.isRank) {
      //提升段位的时候先执行完加星动画之后在升段位,先保存全部stage防止升段之后stage还是原来的数据并没有下下加一个段位
      let stageAll = stage
      stage.length = rankInfo.rank
      this.setData({
        starAnimation: 'increase',
        userInfo: res.data.userInfo,
        star: stage[stage.length - 2].star,
        stage: stage,
        toView: rankInfo.rank - 4
      })
      time = setTimeout(() => {
        stageAll.length = rankInfo.rank + 1
        this.setData({
          star: rankInfo.star,
          stage: stageAll,
          toView: rankInfo.rank - 3
        })
      }, 2100)
    }
    else {
      //判断是否加星
      stage.length = rankInfo.rank + 1
      this.setData({
        userInfo: res.data.userInfo,
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
  },
  match(res) {
    console.log(res.currentTarget.dataset.rank,'match')
    
    let type = res.currentTarget.dataset.rank
    let gold = sheet.Stage.Get(type).goldcoins1
    if (this.data.stage.length > type){
      //通过后台和客户端一起判断来防止数据被篡改
      wsSend('canmatch', {
        rankType: type
      })
      wsReceive('needGold', res => {
        console.log(res)
        this.data.canMatch = false
        wx.showToast({
          title: '金币不足',
          icon: 'none',
          duration: 2000
        })
      })
      if (this.data.canMatch || this.data.userInfo.items[1] >= gold) {
        wx.navigateTo({
          url: '../awaitPK/awaitPK?type=' + type + '&gold=' + gold,
        })
      }
    }
  },
  toDes() {
    wx.navigateTo({
      url: '../rankDes/rankDes',
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
  }
})