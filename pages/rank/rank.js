const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';
Page({
  data: {
    tabAct: true,
    rankData: []
  },
  onLoad(){
    doFetch('english.getfriendrankinglist', {}, (res) => {
      console.log(res.data);
      this.setData({
        rankData: res.data 
      })
    })
  },
  clickTab() {
    this.setData({
      tabAct: !this.data.tabAct
    })
  }
})