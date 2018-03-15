// pages/word/word.js
const app = getApp()
const sheet = require('../../sheets.js')
import { doFetch, wsSend, wsReceive, shareSuc } from '../../utils/rest.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledgePoint: [{ img: 'https://gengxin.odao.com/update/h5/yingyu/word/noun.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/noun-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/noun-small.png', name:'名词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adj.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/adj-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/adj-small.png', name: '形容词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/adv.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/adv-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/adv-small.png', name: '副词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/pron.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/pron-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/pron-small.png', name: '代名词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/num.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/num-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/num-small.png', name: '数词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/verb.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/verb-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/verb-small.png', name: '动词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/art.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/art-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/art-small.png', name: '冠词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/prep.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/prep-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/prep-small.png', name: '介系词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/conj.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/conj-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/conj-small.png', name: '连接词',},
      { img: 'https://gengxin.odao.com/update/h5/yingyu/word/int.png', big: 'https://gengxin.odao.com/update/h5/yingyu/word/int-big.png', small: 'https://gengxin.odao.com/update/h5/yingyu/word/int-small.png', name: '感叹词',}
    ],
    knowInfo: {},
    point: 0,  //选择的知识点
    show:false,  //显示知识点信息
    maxLevel: sheet.Speech.Get(1).endlevel,  //知识点最大等级
    isMax: false,  //知识点等级是否最大
    descript:[],   //知识点描述
    shopping:false,  //显示提醒弹框
    libScanty:false,  //是否是词典数量不足    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dsc;
    dsc = sheet.speechs.map(o=>{
      return new sheet.Speech(o).description;
    })
    this.setData({
      descript: dsc
    })
    doFetch('english.develop',{},(res)=>{
      console.log(res.data);
      this.setData({
        knowInfo: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  //查看知识点具体信息
  check: function (res) {
    let ind = res.currentTarget.dataset.ind;
    if (this.data.knowInfo[ind+1].level == this.data.maxLevel){
      this.setData({
        isMax:true
      })
    }
    else {
      this.setData({
        isMax: false
      })
    }
    this.setData({
      point: ind,
      show:true,
    })
  },

  improve: function() {
    if (this.data.knowInfo[this.data.point + 1].canUp){
      doFetch('english.speechlevelup',{
        spid:this.data.point+1
      },(res)=>{
        let upKnowInfo = this.data.knowInfo;
        upKnowInfo[this.data.point+1] = res.data;
        if (upKnowInfo[this.data.point + 1].level == this.data.maxLevel){
          this.setData({
            isMax: true
          })
        }
        this.setData({
          knowInfo:upKnowInfo
        })
      })
    }
    else{

      if (this.data.knowInfo[this.data.point + 1].levelUP.needI > this.data.knowInfo[this.data.point + 1].levelUP.haveI){
        this.setData({
          libScanty:true
        })
      }
      else{
        this.setData({
          libScanty: false
        })
      }
      this.setData({
        shopping:true
      })
    }
  },

  //隐藏知识点信息弹框
  hide: function() {
    doFetch('english.develop', {}, (res) => {
      this.setData({
        knowInfo: res.data
      })
    })
    this.setData({
      show: false
    })
  },

  //隐藏提示升级物品不足的弹框
  cancel: function() {
    this.setData({
      shopping: false
    })
  },

  shop: function() {
    wx.redirectTo({
      url: '../shopping/shopping',
    })
  },

  hideMask: function() {
    if(this.data.shopping){
      this.setData({
        shopping:false
      })
    }
    else{
      doFetch('english.develop', {}, (res) => {
        console.log(res.data);
        this.setData({
          knowInfo: res.data
        })
      })
      this.setData({
        show:false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
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