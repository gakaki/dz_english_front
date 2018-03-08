const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    tabAct: true,
    rankData: [],
    preSeasonData: []
  },
  onLoad() {
    doFetch('english.getfriendrankinglist', {}, (res) => {
      if (res.data.length > 0) {
        this.setData({
          rankData: res.data.map(this.getSegment)
        })
      }
    })
  },
  getSegment: function (item) {
    item.rank = sheet.Stage.Get(item.rank).stage
    return item
  },
  toDes() {
    wx.navigateTo({
      url: '../rankDes/rankDes'
    })
  },
  clickTab() {
    this.setData({
      tabAct: !this.data.tabAct
    })
    if (this.data.tabAct) {
      doFetch('english.getfriendrankinglist', {}, (res) => {
        if (res.data.length > 0) {
          this.setData({
            rankData: res.data.map(this.getSegment)
          })
        }
      })
    } else {
      doFetch('english.getworldrankinglist', { "season": 0 }, (res) => {
        if (res.data.length > 0) {
          this.setData({
            rankData: res.data.map(this.getSegment)
          })
        }
      })
    }
  },
  preSeason() {
    if (this.data.preSeasonData.length == 0) {
      doFetch('english.getworldrankinglist', { "season": 1 }, (res) => {
        if (typeof (res.data) != 'undefined' && res.data.length > 0) {
          this.setData({
            preSeasonData: res.data.map(this.getSegment),
            rankData: res.data.map(this.getSegment)
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration:500,
            mask: true
          })
        }
      })
    } else {
      this.setData({
        rankData: this.data.preSeasonData
      })
    }

  },
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str3,
      path: '/pages/rank/rank',
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/rank.png',
      success: function () {

      },
      fail: function () {
        // 转发失败
      }
    }
  }
})