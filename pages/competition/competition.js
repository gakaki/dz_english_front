// pages/competition/competition.js

import {Word } from '../../sheets.js'
import { doFetch } from '../../utils/rest.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    words: ['a', 'b', 'b', 'a', 'b', 'b', 'a', 'b', 'b'],
    bgIndex: [false, false, false, false, false, false, false, false, false], //第几个点击，更改背景色
    eraseLetter:[],
    word:{ //word代表单词类型
      type:1,
      speech: 'n.',
      chinese:"苹果,苹果公司，苹果树",
      english:"apple",
      yinbiao:"['æpl]",
      select:["你好","啊哈哈","666","777"]
    },
    letters: [],  //单词变成字母
    hideLetters: [false,false,false,false,false], //要隐藏的字母
    letterPos: [1, 3],
    englishWords: [{
      type: 2,
      speech: 'n.',
      name: "垂死的，临终的",
      english: "dying",
      yinbiao: "['æpl]"
    }, {
      type: 3,
      speech: 'n.',
      name: "染，染色",
      english: "dye",
      yinbiao: "['æpl]"
    }, {
      type: 4,
      speech: 'n.',
      name: "责任，义务；职责，职务；税，关税",
      english: "duty",
      yinbiao: "['æpl]"
    }, {
      type:1,
      speech: 'n.',
      name: "多灰尘的，灰蒙蒙的；粉末状的；灰色的",
      english: "dusty",
      yinbiao: "['æpl]"
    }, {
      type: 2,
      speech: 'n.',
      name: "尘土；粉末",
      english: "dust",
      yinbiao: "['æpl]"}],
    showIndex:0,  //显示顺序
    titleIndex: 0, //单词是第几题 
    backAll: true, //九宫格是否显示为背面
    rotateList: [false, false, false, false, false, false, false, false, false], //true为正面，false为背面
    time:100,
    backClickLimit:3,
    backClickCount:0
    
  },
  onReady(){
    // doFetch('', {
      
    // }, (res) => {
    //   console.log(res)
    //   let englishWords = [];
    //   data.map((v)=>{
    //     englishWords.push(Word.Get(v))
    //   })
    //   this.setData({
    //     englishWords
    //   })
    // });
    // console.log()
  },
  onShow: function (e) {
    let letters = this.data.word.english.split('')
    let letterPos = this.data.letterPos;
    let hideLetters = this.data.hideLetters;
    letterPos.forEach((v)=>{
      hideLetters[v] = true
    })
    this.setData({ 
      letters, 
      hideLetters,
    })
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this._timer()
  },
  _timer(){
    var timer = 0;
    timer = setTimeout(()=>{
      this.setData({
        showIndex: this.data.showIndex + 1
      })
      switch (this.data.showIndex) {
        case 1:  //显示完整单词
          this.setData({
            time: 100
          })
          setTimeout(() => {
            this.audioCtx.play()
          }, 500)
          break;
        case 2:  //擦去部分字母
          if(this.data.word.type === 4) {
            this.setData({
              hideAll: true
            })
          }
          this.setData({
            hideLetter: true
          })

          break;
        case 3:  //显示九宫格
          this.setData({
            time: 100
          })
          break;
        case 4: //显示背面
          this.setData({
            backAll: true
          })
          break;
      }
      console.log(this.data.showIndex)
      clearInterval(timer);
      if (this.data.showIndex < 4) {
        this._timer();
      }
    }, this.data.time);
  },
  showFront(v){
    if (this.data.backClickCount < this.data.backClickLimit) {
      let i = v.currentTarget.dataset.index;
      let inner = v.currentTarget.dataset.inner;
      console.log(inner)
      let letters = this.data.letters;
      let letterPos = this.data.letterPos;
      let hideLetters = this.data.hideLetters;
      let index = letterPos[this.data.backClickCount];
      hideLetters[index] = false;
      letters[index] = inner;
      console.log(letters,hideLetters)
      let rotateList = this.data.rotateList;
      rotateList[i] = true
      this.setData({
        rotateList,
        backClickCount: this.data.backClickCount+1,
        letters,
        hideLetters
      })
    }
  },
  changeBgColor(v) {
    let bgIndex = this.data.bgIndex;
    let i = v.currentTarget.dataset.index;
    if (!bgIndex[i]) {
      bgIndex[i] = true;
      this.setData({
        bgIndex
      })
    }
  },
  audioPlay(){
    this.audioCtx.play()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})