
//获取应用实例
const app = getApp()
let time = null, timer = null
import { doFetch, wsSend, wsReceive, getUid, wsClose, shareSuc, checkoutIsRoom } from '../../utils/rest.js';
import {  getRankImg } from '../../utils/util.js'

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isSelf: {},
    notSelf: {},
    rid: '',
    pkEnd: false,
    frameSelf:'',//我的段位头像框
    frameOther:'',//对战玩家的段位头像框
    isFriend:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    if(options.isFriend) {
      this.setData({
        isFriend: options.isFriend
      })
    }
    
    wsSend('getmatchinfo', {
      rid: options.rid
    })

    wsReceive('matchInfo', res => {
      console.log(res)
      this.getInfo(res)
    })

    this.onPkEndInfo()

  },

  getInfo(res) {
    let userList = res.data.userList
    this.data.rid = res.data.rid
    console.log(res,'resssssssssssssssss')
    if (userList[0].uid == getUid()) {
      this.setData({
        isSelf: userList[0],
        notSelf: userList[1],
        frameSelf: getRankImg(userList[0].lastRank),
        frameOther: getRankImg(userList[1].lastRank)
      })
    }
    else {
      this.setData({
        isSelf: userList[1],
        notSelf: userList[0],
        frameSelf: getRankImg(userList[1].lastRank),
        frameOther: getRankImg(userList[0].lastRank)
      })
    }
    console.log(this.data.isSelf)
    console.log(this.data.notSelf)
  },

  onPkEndInfo() {
    wsReceive('pkEndSettlement', res => {
      this.data.pkEnd = true
      if (res.code) {
        wx.showToast({
          title: '结算出错了'
        })
      }
      else {
        let data = res.data;
        let isFriend = data.isFriend;
        let final = data.final;
        let gold = data.gold;
        let exp = data.exp;

        let userLeft = this.data.isSelf;
        let userRight = this.data.notSelf;
        let [u1, u2] = data.userList;
        let resultLeft, resultRight;

        if (userLeft.uid == u1.info.uid) {
          resultLeft = u1;
          resultRight = u2;
        }
        else {
          resultLeft = u2;
          resultRight = u1;
        }

        //resultLeft/resultRight: {info:player, score:number, continuousRight:number}, final:number//0:失败，1平局 2胜利, changeInfo: isRank: {isRank:isRank,rank:rank},isStarUp: {isStarUp:isStarUp,},isUp: {isUp:isUp,level:level}}
        app.globalData.pkResult = { resultLeft, resultRight, changeInfo: data.pkResult, final, isFriend, exp, gold };
        let isUp = data.pkResult.isUp;
        let show = isUp.isUp;
        let level = isUp.level;
        let url = '';
        if (isUp.awards) {
          let k = isUp.awards.k;
          let v = isUp.awards.v;
          url = '&show=' + show + '&level=' + level + '&k=' + k + '&v=' + v + '&rid=' + this.data.rid + '&otherLeave=' + res.data.isLeave
        } else {
          url = '&show=' + show + '&rid=' + this.data.rid + '&otherLeave=' + res.data.isLeave
        }
       
        wx.redirectTo({
          url: '../result/result?' + url
        })
        wsClose(['pkEndSettlement', 'matchInfo'])
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!this.data.pkEnd){
      timer = setTimeout(() => {
        wx.redirectTo({
          url: '../competition/competition?rid=' + this.data.rid + '&isFriend=' + this.data.isFriend,
        })
      }, 3000)
    }
    
  },
  onHide() {
    checkoutIsRoom(this.data.rid)
    clearTimeout(timer);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]

    if (this.data.rid) {
      prevPage.setData({
        rid: this.data.rid
      })
    }
    if (prevPage.data.starAnimation){
      prevPage.setData({
        fromIndex: true,
        starAnimation: ''
      })
    }
    
    clearTimeout(timer);
    wsClose(['pkEndSettlement','matchInfo'])
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