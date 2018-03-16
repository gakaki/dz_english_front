// pages/friendPK/friendPK.js
const app = getApp()
import { doFetch, wsSend, wsReceive, getUid, wsClose, shareSuc, checkoutIsRoom} from '../../utils/rest.js';
import { getRankFrame } from '../../utils/util.js';
let time = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_00.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_01.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_02.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_03.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_04.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_05.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_06.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_07.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_08.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_09.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_10.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_11.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_12.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_13.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_14.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_15.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_16.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_17.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_18.png',],
    index: 0,
    bystander:0,
    list:[],
    rid:'',
    isOwner:false,
    startGame:false,
    frameSelf:'',
    frameOther:'',
    cancelJoin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('======================onload')
    this.canJoinRoom(options)

    
    
      console.log(this.data.rid, 'roomInfooooooooooo')
      wsReceive('roomInfo', res => {
        console.log(res, 'roomInfo')
        if (res.data.roomStatus == 2) {
          wx.navigateTo({
            url: '../competition/competition?rid=' + this.data.rid + '&isFriend=true',
          })
        }

        console.log(res, '获取用户房间数据')

        if (res.data.userList && res.data.userList[0].info.uid == getUid()) {
          this.setData({
            isOwner: true
          })
        }

        if (res.data.userList.length == 1) {
          // 显示段位框
          this.setData({
            frameSelf: getRankFrame(res.data.userList[0].info.character.season),
          })
        }
        else if (res.data.userList.length == 2) {
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

      // console.log('数据分配成功')

      wsReceive('dissolve', res => {  //房主离开
        console.log(res, 'dissolve')
        wx.reLaunch({
          url: '../index/index?ownerLeave=true',
        })
      })
   
  },
  canJoinRoom(options){
    if (this.data.cancelJoin) { return }
    console.log('检测用户是否登陆')
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
        console.log(res,'房间不存在，收到的数据')
        this.setData({
          rid: res.data.rid
        })
      })
  },
 
  
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('==============onShow', this.data.rid)
    
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
        url: '../duizhan/duizhan?rid=' + res.data.rid + '&isFriend=true',
      })
    })
     
  },
  onUnload() {
    clearInterval(time);
    this.setData({
      cancelJoin: true
    })
    wsClose(['dissolve', 'createSuccess', 'matchSuccess', 'roomInfo','joinSuccess'])
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('=============>onhide')
    checkoutIsRoom(this.data.rid)
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
    console.log(this.data.rid)
    wsSend('leaveroom', { rid: this.data.rid,a: 'leaveroom好友PK页面' })
    wx.reLaunch({
      url: '../index/index',
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