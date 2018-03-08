const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    backData: [],
    show: false,
    awardShow: true,
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
    return item.ifshow == -1
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
      show: false
    })
  },
  toUse() {
    this.hidePop()
  }
})