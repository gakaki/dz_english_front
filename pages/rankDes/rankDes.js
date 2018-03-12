const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, shareSuc } from '../../utils/rest.js';
Page({
  data: {
    stage: [],
    awardIcon: []
  },
  onLoad() {
  
    let stage;
    stage = sheet.stages.map(o => {
      // let obj = {}
      // obj['stage'] = new sheet.Stage(o).stage
      // obj['award'] = new sheet.Stage(o).award
      // obj['frame'] = new sheet.Stage(o).frame
      return new sheet.Stage(o)
    })
    let awardItem = sheet.stages.map(o => {
      return new sheet.Stage(o).award['k']
    })
    let awardIcon = awardItem.map(o => {
      return sheet.Item.Get(o).icon
    })
    this.setData({
      stage: stage,
      awardIcon: awardIcon
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