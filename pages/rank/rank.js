const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    tabAct: true,
    rankData: []
  },
  onLoad(){
    doFetch('english.getfriendrankinglist', {}, (res) => {
      if(res.data.length>0) {
        this.setData({
          rankData: res.data.map(this.getSegment)
        })
      }
    })
  },
  getSegment: function(item) {
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
  }
})