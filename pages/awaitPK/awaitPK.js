//获取应用实例
const app = getApp()
import { doFetch, wsSend, wsReceive  } from '../../utils/rest.js';
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
    gold:0
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
            })
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              title: '获取位置失败，请开启位置权限服务并重试',
              duration: 2000
            })
          }
        });
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function() {
    wsReceive('matchFailed',res=>{
      console.log(res)
      wx.showToast({
        title: '暂未匹配到对手，请稍后再试',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },2500)
      
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //手动取消匹配
    wsSend('cancelmatch')
    
  },
})