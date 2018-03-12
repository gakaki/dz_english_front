// pages/friendPK/friendPK.js
const app = getApp()
import { doFetch, wsSend, wsReceive , getUid } from '../../utils/rest.js';
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
    console.log(options)
    if(options && !options.rid){
      console.log('creatroom')
      wsSend('createroom')
      wsReceive('createSuccess', res => {
        console.log(res, 'creatSuc')
        this.getInfo(res.data.rid)
      })
    }
    else{
      this.getInfo(options.rid)
    } 
    console.log(this.data.rid,'rid')
    
  },
  getInfo(rid){
    this.data.rid = rid
    wsSend('getroominfo', {
      rid: this.data.rid
    })
    wsReceive('roomInfo', res => {
      console.log(res, 'frienPK')
      if (res.data.roomStatus == 2) {
        wx.redirectTo({
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
          frameSelf: getRankFrame(app.globalData.personalInfo.userInfo.character.season),
        })
      }
      else if (res.data.userList.length == 2){
        this.setData({
          frameSelf: getRankFrame(app.globalData.personalInfo.userInfo.character.season),
          frameOther: getRankFrame(res.data.userList[1].info.character.season),
        })
      }
      this.setData({
        bystander: res.data.roomInfo.bystanderCount,
        list: res.data.userList
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    console.log(app.globalData.str1)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearInterval(time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.isOwner && !this.data.startGame){
      wsSend('leaveroom')
      wsReceive('dissolve', res => {
        console.log(res, 'dissolve')
      })
    }
    clearInterval(time);
    wsClose(['dissolve', 'createSuccess', 'matchSuccess','roomInfo'])
  },

  start: function() {
    console.log(111)
    wsSend('startgame',{
      rid: this.data.rid
    })
  },

  giveUp() {
    if(this.data.isOwner){
      wsSend('leaveroom')
      wsReceive('dissolve',res=>{
        console.log(res,'dissolve')
      })
    }
    wx.navigateBack({
      delta: 1
    })
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