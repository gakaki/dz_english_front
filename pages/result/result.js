//获取应用实例
const app = getApp()
import { doFetch, getUid, shareSuc, wsReceive, wsClose } from '../../utils/rest.js';
import { Item } from '../../sheets.js'
let map = [];

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
    notSelf:{},
    name:'',
    num:5,
    iconName:'',
    level:0,
    show:false,
    rid: null
  },
  onLoad: function (e) {
    console.log('===================load')
    console.log(e)
    let hasMap = map.every(v=>{
      return v != 'matchSuccess';
    })
    if(hasMap) {
      // wsClose('matchSuccess')
      wsReceive('matchSuccess', res => {
        wx.redirectTo({
          url: '../duizhan/duizhan?rid=' + res.data.rid,
        })
      })
      map.push('matchSuccess')
    }
    if(e.otherLeave == "true") {
      wx.showToast({
        title: '对方逃跑',
        icon:'none'
      })
    }
    if(e.k) {
      let item = Item.Get(e.k);
      this.setData({
        num: e.v,
        level: e.level,
        iconName: item.cfg.icon,
        name: item.cfg.name
      })
    }
    
    this.setData({
      show: e.show == "true"?true:false,
      rid: e.rid
    })
    console.log(this.data.show,'showwwwwwwwwwwwwwww')
    let pkResult = app.globalData.pkResult
    console.log(pkResult,'pkResult')
    doFetch('english.canshare',{},res=>{
      if(res.data.canShare){
        this.setData({
          shareGold:res.data.num
        })
      }
    }, () => { }, app)

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
    console.log('onunloaddddddddddddddddddddd')
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
    console.log(app.globalData.pkResult.isFriend,'app.globalData.pkResult.isFriend')
    if (!app.globalData.pkResult.isFriend){
      this.setPageInfo()
      wx.navigateBack()
    } else {
      wx.navigateTo({
        url: '../friendPK/friendPK',
      })
    }
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