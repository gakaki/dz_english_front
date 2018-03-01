// pages/word/word.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledgePoint: [{img:'https://gengxin.odao.com/update/h5/yingyu/word/noun.png',name:'名词'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adj.png', name: '形容词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adv.png', name: '副词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/pron.png', name: '代名词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/num.png', name: '数词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/verb.png', name: '动词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/art.png', name: '冠词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/prep.png', name: '介系词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/conj.png', name: '连接词' },
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/int.png', name: '感叹词' }
    ],
    redPoint: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      redPoint: res.currentTarget.dataset.ind
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})