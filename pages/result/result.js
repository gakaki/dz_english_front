//获取应用实例
const app = getApp()
import { doFetch, getUid,shareSuc } from '../../utils/rest.js';

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isVictory: ['https://gengxin.odao.com/update/h5/yingyu/result/shibai.png',              'https://gengxin.odao.com/update/h5/yingyu/result/pingju.png',
'https://gengxin.odao.com/update/h5/yingyu/result/shegnli.png'],
    final:0,
    gold:0,
    exp:0,
    shareGold:0,
    isSelf:{},
    notSelf:{}
  },
  onLoad: function () {
    let pkResult = app.globalData.pkResult
    console.log(pkResult,'pkResult')
    doFetch('english.canshare',{},res=>{
      if(res.data.canShare){
        this.setData({
          shareGold:res.data.num
        })
      }
    })

    if(pkResult.resultLeft.info.uid == getUid()){
      this.setData({
        final: pkResult.final,
        gold: pkResult.gold,
        exp: pkResult.exp,
        isSelf: pkResult.resultLeft,
        notSelf: pkResult.resultRight
      })
    }
    else{
      this.setData({
        final: pkResult.final,
        gold: pkResult.gold,
        exp: pkResult.exp,
        isSelf: pkResult.resultRight,
        notSelf: pkResult.resultLeft
      })
    }
   },
  onUnload() {
    if (!app.globalData.pkResult.isFriend) {
      this.setPageInfo()
    }
  },
  setPageInfo() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    console.log(pages, 'pages')
    prevPage.setData({
      fromIndex: false,
      starAnimation: ''
    })
  },
  toMatch() {
    //是否为好友局
    if (!app.globalData.pkResult.isFriend){
      this.setPageInfo()
    }
    wx.navigateBack()
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