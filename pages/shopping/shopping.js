const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, shareSuc, wsSend, wsReceive, wsClose } from '../../utils/rest.js';
// pages/shoping/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: 0,
    show: false,
    shopData: [],    //道具信息
    itemInfo: [],   //道具itemId对应的item信息
    itemIcon: '',
    shopNum:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempPrice = sheet.shops.map(o=>{
      return o.Price
    })
    let itemIcon = sheet.shops.map(o => {
      return o.icon
    })
    let shopNum = sheet.shops.map(o=>{
      return o.itemid.v
    })
    let itemArr = sheet.shops.map(shp => {
      return sheet.Item.Get(sheet.Shop.Get(shp.id).itemid['k'])
    })
    this.setData({
      shopData: tempPrice,
      itemInfo: itemArr,
      itemIcon: itemIcon,
      shopNum
    })
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
    wsClose('getItem')
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

  hide: function () {
    this.setData({
      show: false
    })
  },

  buy: function () {
    doFetch('weChat.minapppay', 
    { 
      payCount: this.data.shopData[this.data.point],
      payCount:1,
      good: this.data.point+1
    }, (r) => {
      this.hide()
      wx.requestPayment({
        timeStamp: r.data.payload.timeStamp,
        nonceStr: r.data.payload.nonceStr,
        package: r.data.payload.package,
        signType: r.data.payload.signType,
        paySign: r.data.payload.paySign,
        success(res) {
          app.globalData.personalInfo.userInfo.items = res.data
          
          wx.showToast({
            title: '购买成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          wsReceive('getItem', res => {
           
          })
        },
        fail(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })

      
    }, () => { }, app)
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
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str4,
      path: '/pages/index/index',
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/share.png',
      success: function () {
        shareSuc()
      },
      fail: function () {
        // 转发失败
      }
    }
  }
})