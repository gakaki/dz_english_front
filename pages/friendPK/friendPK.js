// pages/friendPK/friendPK.js
const app = getApp()
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
let time = null,timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_00.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_01.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_02.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_03.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_04.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_05.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_06.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_07.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_08.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_09.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_10.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_11.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_12.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_13.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_14.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_15.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_16.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_17.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_18.png',],
    index: 0,
    bystander:0,
    list:[],
    rid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('creatroom')
    wsSend('createroom')
    wsReceive('createSuccess', res => {
      console.log(res)
      this.data.rid = res.data.rid
      wsSend('getroominfo', {
        rid: this.data.rid
      })
      wsReceive('roomInfo', res => {
        console.log(res, 'frienPK')
        if (res.data.roomStatus == 2) {
          wx.redirectTo({
            url: '../competition/competition',
          })
        }
        this.setData({
          bystander: res.data.roomInfo.bystanderCount,
          list: res.data.userList
        })
      })
    })
    console.log(this.data.rid,'rid')
    
    wsReceive('roomNotExist',res=>{
      console.log(res)
      wx.showToast({
        title: '房间不存在',
        icon: 'none',
        duration: 2000
      })
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let i = 0;
    time = setInterval(()=>{
      i++
      if(i>=19){
        i=0
      }
      this.setData({
        index:i
      })
    },150)
    
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
    // wsSend('leaveroom', {
    //     rid: "111111"
    // })
    clearInterval(time);
    clearTimeout(timer);
  },

  start: function() {
    console.log(111)
    wsSend('startgame',{
      rid: this.data.rid
    })
    wsReceive('matchSuccess',res=>{
      console.log(res)
      wx.redirectTo({
        url: '../duizhan/duizhan?rid=' + res.data.roomInfo.rid,
      })
    })
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
    return {
      title: '*******',
      path: '/pages/index/index?friendPK=true&rid=' + this.data.rid,
      // imageUrl: 'https://gengxin.odao.com/update/h5/wangcai/common/share.png',
      success: function () {
        
      },
      fail: function () {
        // 转发失败
      }
    }
  }
})