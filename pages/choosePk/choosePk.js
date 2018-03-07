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
      obj['jia'] = new sheet.Stage(o).goldcoins1
      obj['jian'] = new sheet.Stage(o).goldcoins2
      obj['star'] = new sheet.Stage(o).star
      return obj
    })
    this.setData({
      stage: stage
    })
    console.log(this.data.stage)
  }
})