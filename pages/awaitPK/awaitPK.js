//获取应用实例
const app = getApp()
import { doFetch, wsSend, wsReceive  } from '../../utils/rest.js';
let Bmap = require('../../libs/bmap/bmap-wx.min.js')
let bmap,time=null

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude: '',
    longitude: '',
    ak:"NKGOAVSGiLWsCxmegCdyOfxtRZ2kl8jL",
    gold:0,
    type:0,
    matchSuc:false,
    awaiting:false
  },
  onLoad: function (option) {
    this.setData({
      gold: option.gold
    })
    //实例化百度地图API核心类
    bmap = new Bmap.BMapWX({
      ak: this.data.ak
    }); 
    
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })

        //发起逆向解析地址请求
        bmap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: function (res) {
            console.log(res.originalData.result.addressComponent.city)
            doFetch('english.updateposition', {
              position: res.originalData.result.addressComponent.city
            }, (res) => {
              console.log(res)
              that.setData({
                userInfo: res.data
              })
              //获取位置之后开始匹配
              wsSend('ranking', {
                rankType: option.type
              })
            })
          },
          fail: function (res) {
            console.log(res,'regeocodingFail')
            wx.showToast({
              title: '获取位置失败，请开启位置权限服务并重试',
              duration: 2000
            })
            doFetch('english.updateposition', { position: ' ' }, (res) => {
              console.log(res)
              that.setData({
                userInfo: res.data
              })
              //获取位置之后开始匹配
              wsSend('ranking', {
                rankType: option.type
              })
            })
          }
        });
      },
      fail: function (res) {
        console.log(res,'getLocationFail')
        doFetch('english.updateposition', { position:' '}, (res) => {
          console.log(res)
          that.setData({
            userInfo: res.data
          })
          //获取位置之后开始匹配
          wsSend('ranking', {
            rankType: option.type
          })
        })
      }
    })
    
  },
  onReady: function() {
    //为防止客户端数据被篡改再此处再通过后台判断金币是否足够
    wsReceive('needGold',res=>{
      wx.showToast({
        title: '金币不足',
        icon: 'none',
        duration: 2000
      })
      time = setTimeout(function () {
        console.log(111)
        wx.navigateBack({
          delta: 1
        })
      }, 2500)
    })
    wsReceive('matchFailed',res=>{
      console.log(res,'fail')
      this.data.awaiting = true
      wx.showToast({
        title: '暂未匹配到对手，请稍后再试',
        icon: 'none',
        duration: 2000
      })
      time = setTimeout(function(){
        console.log(111)
        wx.navigateBack({
          delta: 1
        })
      },2500)
    })
    wsReceive('matchSuccess',res=>{
      console.log(res,'suc')
      
      this.data.matchSuc = true
      wx.redirectTo({
        url: '../duizhan/duizhan?rid='+res.data.rid,
      })
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //如果匹配未成功离开此页面则认为取消匹配
    if (!this.data.matchSuc && !this.data.awaiting){
      console.log('cancel')
      wsSend('cancelmatch')
    }
    clearTimeout(time)
  },
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str4,
      path: '/pages/index/index',
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/share.png',
      success: function () {

      },
      fail: function () {
        // 转发失败
      }
    }
  }
})