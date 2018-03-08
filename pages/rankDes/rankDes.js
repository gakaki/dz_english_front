const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    stage: []
  },
  onLoad() {
    let stage;
    stage = sheet.stages.map(o => {
      let obj = {}
      obj['stage'] = new sheet.Stage(o).stage
      obj['award'] = new sheet.Stage(o).award
      return obj
    })
    this.setData({
      stage: stage
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