// pages/friendPK/friendPK.js
const app = getApp()
import { doFetch, wsSend, wsReceive, getUid, wsClose, shareSuc} from '../../utils/rest.js';
import { getRankFrame } from '../../utils/util.js';
let time = null

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
    rid:'',
    isOwner:false,
    startGame:false,
    frameSelf:'',
    frameOther:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.rid) {
      wsSend('joinroom', { rid: res.data.rid })
      this.getInfo(options.rid)
    } else {
      wsSend('joinroom')
      wsReceive('joinSuccess', (res) => {
        console.log('======================onload')
        console.log(res)
        // if (!res.data.isOwner) {
        //   wsSend('joinroom', { rid: res.data.rid })
        // }
        this.getInfo(res.data.rid)
      })    
    }

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
  getInfo(rid){
    this.data.rid = rid
    wsSend('getroominfo', {
      rid: this.data.rid
    })
    console.log(this.data.rid,'roomInfooooooooooo')
    wsReceive('roomInfo', res => {
      console.log(res, 'roomInfo')
      if (res.data.roomStatus == 2) {
        wx.navigateTo({
          url: '../competition/competition?rid=' + this.data.rid,
        })
      }
      if (res.data.userList[0].info.uid == getUid()) {
        this.setData({
          isOwner: true
        })
      }
      if (res.data.userList.length==1){
        // 显示段位框
        this.setData({
          frameSelf: getRankFrame(res.data.userList[0].info.character.season),
        })
      }
      else if (res.data.userList.length == 2){
        this.setData({
          frameSelf: getRankFrame(res.data.userList[0].info.character.season),
          frameOther: getRankFrame(res.data.userList[1].info.character.season),
        })
      }
      this.setData({
        bystander: res.data.roomInfo.bystanderCount,
        list: res.data.userList
      })
    })

    wsReceive('dissolve', res => {  //房主离开
      console.log(res, 'dissolve')
      wx.redirectTo({
        url: '../index/index?ownerLeave=true',
      })
    })
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
    //监听游戏开始
    wsReceive('matchSuccess', res => {
      console.log(res, 'startGame')
      this.data.startGame = true
      wx.redirectTo({
        url: '../duizhan/duizhan?rid=' + res.data.rid,
      })
    })
     
  },
  onUnload() {
    wsClose('joinSuccess')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearInterval(time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  start: function() {
    wsSend('startgame',{
      rid: this.data.rid
    })
  },

  giveUp() {
    wsSend('leaveroom',{rid:this.data.rid})
    wx.navigateBack({
      delta: 1
    })
    clearInterval(time);
    wsClose(['dissolve', 'createSuccess', 'matchSuccess', 'roomInfo'])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.str1,
      path: '/pages/index/index?friendPK=true&rid=' + this.data.rid,
      imageUrl: 'https://gengxin.odao.com/update/h5/yingyu/share/pk.png',
      success: function () {
        shareSuc()
      },
      fail: function () {
        // 转发失败
      }
    }
  }
})