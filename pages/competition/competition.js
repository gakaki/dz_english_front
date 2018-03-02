// pages/competition/competition.js

import {Word } from '../../sheets.js'
import { doFetch,ws } from '../../utils/rest.js';
import { loadEnglishWords, keyboard, hideLettersArr, randomHideLetters} from './fn.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nineLetters: [], //九宫格字母
    bgIndex: [false, false, false, false, false, false, false, false, false], //第几个点击，更改背景色
    word: {},
    letters: [],  //单词变成字母
    hideLetters: [], //要隐藏的字母
    englishWords: [],
    showIndex:0,  //显示顺序
    titleIndex: 0, //单词是第几题 
    backAll: true, //九宫格是否显示为背面
    rotateList: [false, false, false, false, false, false, false, false, false], //true为正面，false为背面
    time:100,
    backClickCount:0,
    answer:0, //0不显示正确和错误按钮，1表示正确，2表示错误
    round:1,
    roundName:null
  },
  onReady(){
    this.setData({
      englishWords: loadEnglishWords(),
    })
    this.roundInit();
  },
  onShow: function (e) {
    
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this._timer()
  },
  roundInit(){
    this.setData({
      word: this.data.englishWords[this.data.round-1]
    })
    let word = this.data.word;
    let letters = word.english.split('');
    let hideLetters = hideLettersArr(word.english.trim().length);
    switch (word.type) { //题目类型
       case 1:
        let letterPos = word.eliminate;
        let nowPos = [];
        let length = word.english.length;
        if (word.eliminate == -1) {
          randomHideLetters(length, word.eliminateNum)
        }
        letterPos.forEach((v) => {
          hideLetters[v] = true
        })
        this.setData({
          letters,
          hideLetters
        })
        
    }



    this.keyboard(); //渲染九宫格键盘
  },
  keyboard(){
    let letterPos = this.data.word.eliminate;
    let english = this.data.word.english;
    this.setData({
      nineLetters: keyboard(letterPos, english)
    })
    console.log(this.data.nineLetters)
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
    let bcCount = this.data.backClickCount;
    let bcLimit = this.data.word.eliminateNum;
    let letters = this.data.letters;

    if (bcCount < bcLimit) {
      let i = v.currentTarget.dataset.index; //点击的第几个牌面
      let inner = v.currentTarget.dataset.inner;  //牌面对应的字母
      let letterPos = this.data.word.eliminate;  //要隐藏的字母位置
      let hideLetters = this.data.hideLetters;  //对应的字母位置是否要隐藏
      let index = letterPos[bcCount];   //第几次点击对应的字母位置
      hideLetters[index] = false;  //将该位子的背面转成正面
      letters[index] = inner;   //正面的字母显示到上面
      console.log(inner,letters,hideLetters)
      let rotateList = this.data.rotateList;  //翻牌的列表
      rotateList[i] = true
      this.setData({
        rotateList,
        backClickCount: bcCount+1,
        letters,
        hideLetters
      })

      if (bcCount == bcLimit - 1) {
        let word = letters.join('');
        if(word == this.data.word.english) {
          this.setData({
            answer:1
          })
        } else {
          this.setData({
            answer: 2
          })
        }
      }
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