const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch } from '../../utils/rest.js';

Component({
  properties:{
    tian: {
      type: String,
      value: '0'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    reward:[]
  },

  attached() {
    let landing;
    let reward=[];
    
    landing = sheet.landings.map(o => {
      return new sheet.Landing(o).itemid;
    })
    for(let i = 0;i<landing.length;i++){
      let obj = {}
      obj.name = sheet.Item.Get(landing[i][0].k).name
      obj.icon = sheet.Item.Get(landing[i][0].k).icon
      obj.num = landing[i][0].v
      obj.day = '第'+i+'天'
      reward[i] = obj
    }
    console.log(reward)
    this.setData({
      reward:reward
    })
  },

  methods: {
    getReward() {
      doFetch('english.signin', {}, res => {
        console.log(res,'landingSuc')
      })
    }
  }

})