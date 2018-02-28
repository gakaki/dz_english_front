// pages/competition/competition.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words: ['a', 'b', 'b', 'a', 'b', 'b', 'a', 'b', 'b'],
    bgColor: "#fff",
    bgIndex:null,
    word:{
      type:0,
      name:"苹果,苹果公司，苹果树",
      english:"apple",
      yinbiao:"['æpl]"
    },
    time:10,
    showIndex:0,
    letters:[{  //0代表没点击，1代表正确，2代表错误
      type:0,
      color:null,
      bgColor: null
    },{
      type: 0,
      color: null,
      bgColor: null
    },{
      type: 0,
      color: null,
      bgColor: null
    }, {
      type: 0,
      color: null,
      bgColor: null
    }, {
      type: 0,
      color: null,
      bgColor: null
    }, {
      type: 0,
      color: null,
      bgColor: null
    }, {
      type: 1,
      color: "#fff",
      bgColor: "#19b1ff"
    }, {
      type: 2,
      color: "#fff",
      bgColor: "#ff4263"
    }, {
      type: 0,
      color: null,
      bgColor: null
    }]
  },
  onShow: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    // this.audioCtx = wx.createAudioContext('myAudio')
    // setTimeout(() => {
    //   this.audioCtx.play()
    //   var timer = 0;
    //     timer = setInterval(() => {
    //       if (this.data.time > 0) {
    //         this.setData({
    //           time: this.data.time - 1
    //         })
    //       } else {
    //         clearInterval(timer)
    //         this.setData({
    //           showIndex:1
    //         })
    //       }
    //     }, 1000)
    // },500)
  },
  changeBgColor(v){
    console.log(v.currentTarget.dataset.index)
    this.setData({
      bgIndex: v.currentTarget.dataset.index
    })
  },
  audioPlay(){
    // this.audioCtx.play()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})