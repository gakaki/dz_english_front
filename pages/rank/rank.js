const app = getApp()
const sheet = require('../../sheets.js')
import { getRankFrame, getPersonFrame } from '../../utils/util.js'

import { doFetch, shareSuc } from '../../utils/rest.js';

Page({
  data: {
    tabAct: true,
    rankData: [],
    rankFrame: '',
    tebSeason: '查看上赛季排行榜'
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
    }, () => { }, app)
  },
  getSegment: function (item) {
    let obj = {}
    obj = item
    obj.rank = sheet.Stage.Get(obj.rank).stage
    if (obj.hasOwnProperty('location') == false || obj.location == ' ') {
      obj.location = sheet.Constant.Get(3).value.split(",")[Math.floor(Math.random() * 4)] 
    }
    return obj
  },
  toDes(e) {
    if (app.preventMoreTap(e)) { return; }
    wx.navigateTo({
      url: '../rankDes/rankDes'
    })
  },
  clickTab(e) {
    if (e.target.dataset.id == 1) {
      this.setData({
        tabAct: true
      })
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
            duration: 1000,
            mask: true
          })
          this.setData({
            rankData: []
          })
        }
      }, () => { }, app)
    } else {
      this.getWordData()
    }
  },
  getWordData() {
    this.setData({
      tabAct: false,
      tebSeason: '查看上赛季排行榜'
    })
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
    }, () => { }, app)
  },
  preSeason() {
    if (this.data.tebSeason == '查看上赛季排行榜') {
        doFetch('english.getworldrankinglist', { "season": 1 }, (res) => {
          this.setData({
            tebSeason: '查看本赛季排行榜'
          })
          if (typeof (res.data) != 'undefined' && res.data.length > 0) {
            this.setData({
              rankFrame: res.data.map(o => {
                return getPersonFrame(o.rank)
              })
            })
            this.setData({
              rankData: res.data.map(this.getSegment)
            })
            console.log(this.data.rankData)
          } else {
            this.setData({
              rankData: []
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 500,
              mask: true
            })
          }
        }, () => { }, app)
    }else {
      this.getWordData()
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