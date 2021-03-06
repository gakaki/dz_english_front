const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, shareSuc } from '../../utils/rest.js';
Page({
  data: {
    stage: [],
    awardIcon: [
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-copper.png', 'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-silver.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-silver.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-silver.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-silver.png', 'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-gold.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-gold.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-gold.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-gold.png',
      'https://gengxin.odao.com/update/h5/yingyu/rankDes/box-gold.png']
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
    stage = stage.reverse();
    let awardIcon = this.data.awardIcon.reverse();
    this.setData({
      stage,
      awardIcon
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