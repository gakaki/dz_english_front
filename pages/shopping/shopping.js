// pages/shoping/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [{ img:'https://gengxin.odao.com/update/h5/yingyu/shopping/copper-box.png',name:'铜宝箱'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/shopping/silver-box.png', name: '银宝箱'},
      { img:'https://gengxin.odao.com/update/h5/yingyu/shopping/gold-box.png', name:'金宝箱'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/shopping/gold.png', name: '金币'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/shopping/golds.png', name: '金币'},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/shopping/goldss.png', name: '金币堆'}
    ],
    point:0,
    show:false
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

  check: function (res) {
    let ind = res.currentTarget.dataset.ind;
    
    this.setData({
      point: ind,
      show: true
    })
  },

  hide: function() {
    this.setData({
      show:false
    })
  },

  buy: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})