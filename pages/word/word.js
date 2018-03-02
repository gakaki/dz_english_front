// pages/word/word.js
const app = getApp()
const sheet = require('../../sheets.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledgePoint: [{ img: 'https://gengxin.odao.com/update/h5/yingyu/word/noun.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/noun-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/noun-small.png', name:'名词'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adj.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/adj-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/adj-small.png', name: '形容词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adv.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/adv-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/adv-small.png', name: '副词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/pron.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/pron-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/pron-small.png', name: '代名词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/num.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/num-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/num-small.png', name: '数词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/verb.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/verb-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/verb-small.png', name: '动词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/art.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/art-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/art-small.png', name: '冠词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/prep.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/prep-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/prep-small.png', name: '介系词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/conj.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/conj-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/conj-small.png', name: '连接词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/int.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/int-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/int-small.png', name: '感叹词' }
    ],
    redPoint: -1,
    show:false,
    canUpdate: false,
    maxLevel: sheet.Speech.Get(1).endlevel,
    descript:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.maxLevel);
    let a;
    a = sheet.speechs.map(o=>{
      return new sheet.Speech(o).description;
    })
    console.log(a)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  check: function (res) {
    this.setData({
      redPoint: res.currentTarget.dataset.ind,
      show:true
    })
  },

  hide: function() {
    this.setData({
      show: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})