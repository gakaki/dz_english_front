const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
Page({
  data: {
    userInfo:{},
    stage: [],
    star: 0,
    toView:0
  },
  onLoad() {
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
    console.log(res.currentTarget.dataset.rank)
    wsSend('ranking', {
      rankType: res.currentTarget.dataset.rank
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
  }
})