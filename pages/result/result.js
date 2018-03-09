//获取应用实例
const app = getApp()
import { doFetch, wsSend, wsReceive, getUid } from '../../utils/rest.js';

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isVictory:'https://gengxin.odao.com/update/h5/yingyu/result/shegnli.png',
    shareGold:0,
    isSelf:{},
    notSelf:{}
  },
  onLoad: function () {
    let pkResult = app.globalData.pkResult
    console.log(app.globalData.pkResult,'pkResult')
    doFetch('english.getshareaward',{},res=>{
      if(res.code==0){
        this.setData({
          shareGold:res.data.num
        })
      }
    })

    if(pkResult.resultLeft.info.uid == getUid()){
      this.setData({
        isSelf: pkResult.resultLeft,
        notSelf: pkResult.resultRight
      })
    }
    else{
      this.setData({
        isSelf: pkResult.resultRight,
        notSelf: pkResult.resultLeft
      })
    }
   },
  toMatch() {
    wx.redirectTo({
      url: '../choosePk/choosePk',
    })
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