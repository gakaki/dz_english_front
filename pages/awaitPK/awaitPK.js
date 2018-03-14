//获取应用实例
const app = getApp()
const sheet = require('../../sheets.js')
import { getRankFrame } from '../../utils/util.js';
import { doFetch, wsSend, wsReceive, shareSuc, wsClose  } from '../../utils/rest.js';
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
    awaiting:false,
    frame:'',
  },
  onLoad: function (option) {
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

    this.setData({
      gold: option.gold
    })
    //实例化百度地图API核心类
    // bmap = new Bmap.BMapWX({
    //   ak: this.data.ak
    // }); 
    
    wsSend('ranking', {
      rankType: option.type
    })

    // let that = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })

    //     //发起逆向解析地址请求
    //     bmap.regeocoding({
    //       location: that.data.latitude + ',' + that.data.longitude,
    //       success: function (res) {
    //         console.log(res.originalData.result.addressComponent.city)
    //         doFetch('english.updateposition', {
    //           position: res.originalData.result.addressComponent.city
    //         }, (res) => {
    //           console.log(res)
    //           // that.setData({
    //           //   userInfo: res.data
    //           // })
    //           //获取位置之后开始匹配
              
    //         })
    //       },
    //       fail: function (res) {
    //         console.log(res,'regeocodingFail')
    //         wx.showToast({
    //           title: '获取位置失败，请开启位置权限服务并重试',
    //           duration: 2000
    //         })
    //         doFetch('english.updateposition', { position: ' ' }, (res) => {
    //           console.log(res)
    //           that.setData({
    //             userInfo: res.data
    //           })
    //           //获取位置之后开始匹配
    //           wsSend('ranking', {
    //             rankType: option.type
    //           })
    //         })
    //       }
    //     });
    //   },
    //   fail: function (res) {
    //     console.log(res, 'getLocationFail')
    //     let location = sheet.Constant.Get(3).value.split(',')
    //     let index = Math.floor(Math.random()*location.length)
    //     let choosePoa = location[index]
    //     doFetch('english.updateposition', { position:choosePoa}, (res) => {
    //       console.log(res)
    //       that.setData({
    //         userInfo: res.data
    //       })
    //       //获取位置之后开始匹配
    //       wsSend('ranking', {
    //         rankType: option.type
    //       })
    //     })
    //   }
    // })
    
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
        console.log('matchFailed back')
        wx.navigateBack({
          delta: 1
        })
      },2100)
    })
    wsReceive('matchSuccess',res=>{
      console.log(res,'suc')
      
      this.data.matchSuc = true
      wx.redirectTo({
        url: '../duizhan/duizhan?rid='+res.data.rid,
      })
    })
  },
  onShow() {
    this.setData({
      frame:getRankFrame(app.globalData.personalInfo.userInfo.character.season)
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
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        fromIndex: true,
        starAnimation: ''
      })
    }
    clearTimeout(time)
    wsClose(['matchSuccess', 'matchFailed','needGold'])
  },
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