const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    stage: [],
    rank: 0
  },
  onLoad() {
    doFetch('english.showpersonal', {}, (res) => {

      let seasonRank = res.data.userInfo.character.season
      let rank
      for (let key in seasonRank) {
        rank = seasonRank[key]
      }
      rank = rank.rank
      let stage;
      stage = sheet.stages.map(o => {
        let obj = {}
        obj['stage'] = new sheet.Stage(o).stage
        obj['jia'] = new sheet.Stage(o).goldcoins1
        obj['jian'] = new sheet.Stage(o).goldcoins2
        obj['star'] = new sheet.Stage(o).star
        return obj
      })
      stage.length = rank+1
      this.setData({
        stage: stage
      })
      console.log(this.data.stage)
    })
    
  }
})