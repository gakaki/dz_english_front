// pages/friendPK/friendPK.js
const app = getApp()
import { doFetch, wsSend, wsReceive, getUid, wsClose, shareSuc, checkoutIsRoom, wsConnect} from '../../utils/rest.js';
import { getRankImg} from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    bystander:0,
    list:[],
    rid:'',
    isOwner:false,
    startGame:false,
    frameSelf:'',
    frameOther:'',
    cancelJoin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.wsConnect) {
      wsConnect()
    }
    this.canJoinRoom(options)

      wsReceive('room', res => {
        console.log(res,'room')
        if (res.data.roomStatus == 2) {
          wx.navigateTo({
            url: '../competition/competition?rid=' + this.data.rid + '&isFriend=true',
          })
        }
        
        if (res.data.userList && res.data.userList[0].uid == getUid()) {
          this.setData({
            isOwner: true
          })
        }
        
        if (res.data.userList.length == 1) {
          // 显示段位框
          this.setData({
            frameSelf: getRankImg(res.data.userList[0].lastRank),
          })
        }
        else if (res.data.userList.length == 2) {
          this.setData({
            frameSelf: getRankImg(res.data.userList[0].lastRank),
            frameOther: getRankImg(res.data.userList[1].lastRank),
          })
        }
        this.setData({
          bystander: res.data.roomInfo.bystanderCount,
          list: res.data.userList
        })
      })

      wsReceive('dissolve', res => {  //房主离开
        wx.reLaunch({
          url: '../index/index?ownerLeave=true',
        })
      })
   
  },
  canJoinRoom(options){
    if (this.data.cancelJoin) { return }
    if (app.globalData.logined && app.globalData.wsConnect) {
      this.joinRoom(options)
    } else {
      setTimeout(() => {
        this.canJoinRoom(options);
      }, 500)
    }
  },
  joinRoom(options){
      wsSend('joinroom', { rid: options.rid })
      wsReceive('joinSuccess', (res) => {
        console.log(res)
        this.setData({
          rid: res.data.rid
        })
      })
  },
 
  
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    //监听游戏开始
    wsReceive('matchSuccess', res => {
      this.data.startGame = true
      wx.redirectTo({
        url: '../duizhan/duizhan?rid=' + res.data.rid + '&isFriend=true',
      })
    })
     
  },
  onUnload() {
    this.setData({
      cancelJoin: true
    })
    wsClose(['dissolve', 'createSuccess', 'matchSuccess', 'room','joinSuccess'])
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    checkoutIsRoom(this.data.rid)
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
    wsSend('leaveroom', { rid: this.data.rid,a: 'leaveroom好友PK页面' })
    wx.reLaunch({
      url: '../index/index',
    })
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