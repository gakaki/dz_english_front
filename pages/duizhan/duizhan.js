
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_00.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_01.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_02.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_03.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_04.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_05.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_06.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_07.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_08.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_09.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_10.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_11.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_12.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_13.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_14.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_15.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_16.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_17.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_18.png',],
    index: 0,
    time:null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let i = 0;
    this.data.time = setInterval(() => {
      i++
      if (i >= 19) {
        i = 0
      }
      this.setData({
        index: i
      })
    }, 150)

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.time);
  },
})