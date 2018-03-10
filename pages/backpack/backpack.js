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
    src: '',
    itemId: 0,
    awardData: []
  },
  onLoad() {
    this.init()
  },
  init() {
    let items = app.globalData.personalInfo.userInfo.items
    let temp;
    temp = sheet.items.map(o => {
      return new sheet.Item(o);
    })
    this.setData({
      backData: temp.filter(this.filter)
    })
    this.setData({
      backData: this.data.backData.map(o => {
        let id = o.cfg.id
        o.cfg['num'] = items[id] ? items[id] : 0
        return o
      })
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
      src: e.currentTarget.dataset.src,
      itemId: e.currentTarget.dataset.id
    })
  },
  hidePop() {
    this.setData({
      show: false,
      awardShow: false
    })
  },
  toUse() {
    this.setData({
      show: false
    })
    doFetch('english.makesurprise', { itemId: this.data.itemId }, (res) => {
      console.log(res.data)
      let tempArr = []
      let data = res.data
      for (let key in data) {
        let obj = {}
        obj[key] = data[key]
        tempArr.push(obj)
      }
      console.log(tempArr)
      let aa = tempArr.map(o => {
        let iInfo
        for (let k in o) {
          iInfo = sheet.Item.Get(k)
          iInfo.cfg['count'] = o[k]
        } 
        console.log(iInfo)
        return iInfo
      })
      this.setData({
        awardShow: true,
        awardData: aa
      })
      doFetch('english.showpersonal', {}, (res) => {
        app.globalData.personalInfo = res.data
        this.init()
      })


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