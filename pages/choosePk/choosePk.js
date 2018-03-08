const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
Page({
  data: {
    userInfo:{},
    stage: [],
    star: 0,
    toView:0,
    season:{},
    canMatch:true
  },
  onLoad() {
    doFetch('english.getseason',{},res=>{
      this.setData({
        season: sheet.Season.Get(res.data.season)
      })
      wx.setNavigationBarTitle({
        title: this.data.season.cfg.name
      })
    })
    doFetch('english.showpersonal', {}, (res) => {
      console.log(res,'season')

      //获取用户当前赛季信息
      let season = res.data.userInfo.character.season
      let rankInfo
      for (let key in season) {
        rankInfo = season[key]
      }
      
      //通过读表获取段位信息
      let stage;
      stage = sheet.stages.map(o => {
        let obj = {}
        obj['stage'] = new sheet.Stage(o).stage
        obj['jia'] = new sheet.Stage(o).goldcoins2
        obj['jian'] = new sheet.Stage(o).goldcoins1
        obj['star'] = new sheet.Stage(o).star
        return obj
      })
      stage.length = rankInfo.rank+1
      this.setData({
        userInfo: res.data.userInfo,
        star: rankInfo.star,
        stage: stage,
        toView: rankInfo.rank-3
      })
      console.log(this.data.stage)
    })
    
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
  match(res) {
    console.log(res.currentTarget.dataset.rank,'match')
    let type = res.currentTarget.dataset.rank
    let gold = sheet.Stage.Get(type).goldcoins1
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
    if (this.data.canMatch || this.data.userInfo.items[1] >= gold){
      wx.navigateTo({
        url: '../awaitPK/awaitPK?type='+type + '&gold=' +gold ,
      })
    }
  }
})