//获取应用实例
const app = getApp()
let Bmap = require('../../libs/bmap/bmap-wx.min.js')
let bmap

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude: '',
    longitude: '',
    ak:"NKGOAVSGiLWsCxmegCdyOfxtRZ2kl8jL",
  },
  onLoad: function () {
    bmap = new Bmap.BMapWX({
      ak: this.data.ak
    }); 
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })

        bmap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: function(res){
            console.log(res)
          },
          fail: function(res){
            console.log(res)
            wx.showToast({
              title: '获取位置失败，请开启位置权限服务并重试',
              duration: 2000
            })
          }
        });
      },
    })
  },
})