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
  }
})