const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    backData: [],
    show: false,
    awardShow: false,
    name: '',
    desc: '',
    src: ''
  },
  onLoad() {
    let temp;
    temp = sheet.items.map(o => {
      return new sheet.Item(o);
    }) 
    this.setData({
      backData: temp.filter(this.filter)
    })
    console.log(this.data.backData)
  },
  filter(item) {
    return item.ifshow == 1
  },
  showPop(e) {
    this.setData({
      show: true,
      name: e.currentTarget.dataset.name,
      desc: e.currentTarget.dataset.desc,
      src: e.currentTarget.dataset.src
    })
console.log(e)
  },
  hidePop() {
    this.setData({
      show: false,
      awardShow: false
    })
  },
  toUse() {
    this.setData({
      show: false,
      awardShow: true
    })
    //this.hidePop()
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