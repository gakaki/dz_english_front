//获取应用实例
const app = getApp()
import { doFetch, getUid, shareSuc, wsReceive, wsClose } from '../../utils/rest.js';
import { Item } from '../../sheets.js'
import { getRankImg } from '../../utils/util.js'
let map = [];
let first = true;

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
    rid: null,
    frameSelf: '',//我的段位头像框
    frameOther: '',//对战玩家的段位头像框
  },
  onLoad: function (e) {
    console.log(e)
    let hasMap = map.every(v=>{
      return v != 'matchSuccess';
    })
    if(hasMap) {
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
    let pkResult = app.globalData.pkResult;
    doFetch('english.canshare',{},res=>{
      if(res.data.canShare){
        this.setData({
          shareGold:res.data.num
        })
      }
    }, () => { }, app)
    if(pkResult.resultLeft.uid == getUid()){
      this.setData({
        final: pkResult.final,
        gold: pkResult.gold,
        exp: pkResult.exp,
        isSelf: pkResult.resultLeft,
        notSelf: pkResult.resultRight,
        frameSelf: getRankImg(pkResult.resultLeft.lastRank),
        frameOther: getRankImg(pkResult.resultRight.lastRank)
      })
    }
    else{
      this.setData({
        final: pkResult.final,
        gold: pkResult.gold,
        exp: pkResult.exp,
        isSelf: pkResult.resultRight,
        notSelf: pkResult.resultLeft,
        frameSelf: getRankImg(pkResult.resultRight.lastRank),
        frameOther: getRankImg(pkResult.resultLeft.lastRank)
      })
    }
   },
  onUnload() {
    if (!app.globalData.pkResult.isFriend) {
      this.setPageInfo()
    }
  },
  setPageInfo() {
    if (!first) {return};
    first = false;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.setData) {
      prevPage.setData({
        fromIndex: false,
        starAnimation: ''
      })
    }
  },
  toMatch() {
    //是否为好友局
    if (!app.globalData.pkResult.isFriend){
      this.setPageInfo()
      wx.navigateBack()
    } else {
      wx.redirectTo({
        url: '../friendPK/friendPK',
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '我在英文乐翻天对战中获得了' + this.data.isSelf.score + '分，来试试你能的多少分？',
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
