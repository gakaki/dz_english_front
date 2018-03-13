const app = getApp()
const sheet = require('../../sheets.js')
import { getRankFrame, getPersonFrame } from '../../utils/util.js'

import { doFetch, shareSuc } from '../../utils/rest.js';

Page({
  data: {
    tabAct: true,
    rankData: [],
    preSeasonData: [],
    rankFrame: ''
  },
  onLoad() {
    doFetch('english.getfriendrankinglist', {}, (res) => {
      if (res.data.length > 0) {
        this.setData({
          rankFrame: res.data.map(o => {
            return getPersonFrame(o.rank)
          })
        })

        this.setData({
          rankData: res.data.map(this.getSegment)
        })

       
      } else {
        wx.showToast({
          title: '暂无数据',
          icon: 'none',
          duration: 500,
          mask: true
        })
      }
    })
  },
  getSegment: function (item) {
    item.rank = sheet.Stage.Get(item.rank).stage
    if (item.hasOwnProperty('location') == false || item.location == ' ') {
      item.location = sheet.Constant.Get(3).value.split(",")[Math.floor(Math.random() * 4)] 
    }
    return item
  },
  toDes(e) {
    if (app.preventMoreTap(e)) { return; }
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
            rankFrame: res.data.map(o => {
              return getPersonFrame(o.rank)
            })
          })
          this.setData({
            rankData: res.data.map(this.getSegment)
          })

        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 500,
            mask: true
          })
          this.setData({
            rankData: []
          })
        }
      })
    } else {
      doFetch('english.getworldrankinglist', { "season": 0 }, (res) => {
        if (res.data.length > 0) {
          this.setData({
            rankFrame: res.data.map(o => {
              return getPersonFrame(o.rank)
            })
          })
          this.setData({
            rankData: res.data.map(this.getSegment)
          })

        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 500,
            mask: true
          })
          this.setData({
            rankData: []
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
            rankFrame: res.data.map(o => {
              return getPersonFrame(o.rank)
            })
          })
          this.setData({
            preSeasonData: res.data.map(this.getSegment),
            rankData: res.data.map(this.getSegment)
          })

        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 500,
            mask: true
          })
        }
      })
    } else {
      rankFrame: res.data.map(o => {
        return getPersonFrame(o.rank)
      })
      this.setData({
        rankData: this.data.preSeasonData
      })
     
    }

  },
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str3,
      path: '/pages/index/index?rank=true',
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/rank.png',
      success: function () {
        shareSuc()
      },
      fail: function () {
        // 转发失败
      }
    }
  }
})