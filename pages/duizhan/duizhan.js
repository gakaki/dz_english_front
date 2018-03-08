
//获取应用实例
const app = getApp()
let time = null, timer = null, time_dianiu = null, time_p_lizi = null, time_k_lizi=null

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_00.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_01.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_02.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_03.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_04.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_05.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_06.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_07.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_08.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_09.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_10.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_11.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_12.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_13.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_14.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_15.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_16.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_17.png', 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/anima01_18.png',],
    index: 0,

    animation_dianliu_left: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_01.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_02.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_03.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_04.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_05.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_06.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_07.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_08.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_09.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_10.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_11.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_12.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuL_13.png',],

    animation_dianliu_right: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_01.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_02.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_03.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_04.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_05.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_06.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_07.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_08.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_09.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_10.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_11.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_12.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/dianliuR_13.png',],
    index_dianliu: 0,
    yincang:'',//设置隐藏最后一张帧动画

    animation_p_lizi: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_01.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_02.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_03.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_04.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_05.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_06.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_07.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_08.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_09.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_10.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_11.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_12.png',
      'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/p_lizi_13.png',],
      index_p_lizi: 0,

      animation_k_lizi: ['https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_01.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_02.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_03.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_04.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_05.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_06.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_07.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_08.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_09.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_10.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_11.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_12.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_13.png',
        'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/k_lizi_14.png',],
      index_k_lizi: 0,
  },
  onLoad: function () {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 手机气泡序列帧动画定时器
    let i = 0,j = 0,p = 0,k = 0;
    time = setInterval(() => {
      i++
      if (i >= 19) {
        i = 0
      }
      this.setData({
        index: i
      })
    }, 150)
    //电流序列帧动画定时器
    time_dianiu = setInterval(()=>{
      if(j++>=13){
        this.setData({
          yincang:'dianliu-yincang'
        })
        clearInterval(time_dianiu);
      }
      this.setData({
        index_dianliu: j
      })
    },100)
    //pk-p粒子序列帧动画定时器
    time_p_lizi = setInterval(() => {
      if (p++ >= 13) {
        p = 0
      }
      this.setData({
        index_p_lizi: p
      })
    }, 150)
    //pk-k粒子序列帧动画定时器
    time_k_lizi = setInterval(() => {
      if (k++ >= 14) {
        k = 0
      }
      this.setData({
        index_k_lizi: k
      })
    }, 150)


    // timer = setTimeout(()=>{
    //   wx.redirectTo({
    //     url: '../competition/competition',
    //   })
    // },3000)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(time);
    clearTimeout(timer);
    clearInterval(time_p_lizi);
    clearInterval(time_k_lizi);
  },
})