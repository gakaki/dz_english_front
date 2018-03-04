// pages/competition/competition.js

import { Word } from '../../sheets.js'
import { doFetch,ws } from '../../utils/rest.js';
import { loadEnglishWords, keyboard, getRoundName,hideLettersArr, randomHideLetters, changeArrAllValue} from './fn.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:null,
    nineLetters: [], //九宫格字母
    bgIndex: [false, false, false, false, false, false, false, false, false], //第几个点击，更改背景色
    word: {},
    letters: [],  //单词变成字母
    hideLetters: [], //要隐藏的字母
    hideAllLetters: false, //隐藏所有字母
    englishWords: [],
    showIndex:0,  //显示顺序
    titleIndex: 0, //单词是第几题 
    rotateList: [true, true, true, true, true, true, true, true, true], //true为正面，false为背面
    time:2000,
    clockStart: false,
    backClickCount:0,
    answer:0, //0不显示正确和错误按钮，1表示正确，2表示错误
    round:1,
    roundName:null,
    selectAnswer:[0,0,0,0]  //0为未选择，1为正确，2为错误
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
    
  },
  roundInit(){
    this.setData({
      word: this.data.englishWords[this.data.round-1],
      title: getRoundName(this.data.round),
      showIndex: 0,
      rotateList: changeArrAllValue(this.data.rotateList, true),
      answer:0,
      backClickCount:0
    })
    let word = this.data.word;
    let letters = word.english.split('');
    let hideLetters = hideLettersArr(word.english.length);
    switch (word.type) { //题目类型
       case 1:
        let letterPos = word.eliminate;
        let nowPos = [];
        let length = word.english.length;
        if (word.eliminate == -1) {
          letterPos = randomHideLetters(length, word.eliminateNum)
          word.eliminate = letterPos;
        }
        this.setData({
          letters,
          hideLetters
        })
        this.keyboard(); //渲染九宫格键盘
        break;

    }
    this.timer()
  },
  timer(){
    var timerCount = 0;
    timerCount = setTimeout(()=>{
      this.setData({
        showIndex: this.data.showIndex + 1
      })
      let type = this.data.word.type;
      switch (this.data.showIndex) {
        case 1:  //显示完整单词
          this.setData({
            time: 3000
          })
          setTimeout(() => {
            this.audioCtx.play()
          }, 1000)
          break;
        case 2:  //擦去部分字母
          let letterPos = this.data.word.eliminate;
          let hideLetters = this.data.hideLetters;
          if(type == 1) {
            letterPos.forEach((v) => {
              hideLetters[v] = true
            })
            this.setData({
              hideLetters,
              time:1000,
              clockStart: true
            })
          }
          if(type === 4) {
            this.setData({
              hideAllLetters: true,
              time: 1000
            })
          }
          break;
        case 3:  //显示九宫格
          this.setData({
            time: 3000
          })
          break;
        case 4: //显示背面
          this.setData({
            rotateList: changeArrAllValue(this.data.rotateList,false),
            time:2000
          })
          break;
      }
      clearInterval(timerCount);
      if (this.data.showIndex < 4) {
        this.timer();
      }
    }, this.data.time);
  },
  showFront(v){
    let bcCount = this.data.backClickCount;
    let bcLimit = this.data.word.eliminateNum;
    let letters = this.data.letters;
    console.log(bcCount, bcLimit)
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
        let answer = 0;
        console.log(letters,word,this.data.word.english)
        if(word == this.data.word.english) {
          answer = 1
        } else {
          answer = 2
        }
        setTimeout(() => {
          this.setData({
            answer,
            round: this.data.round + 1,
          })
        },500)
        setTimeout(()=>{
          if (this.data.round < 5) {
            this.roundInit()
          } else {
            console.log('结束')
          }
        },3000)
      }
    }
  },
  selectAnswer(v){
    let obj = v.currentTarget.dataset;

    let selectAnswer = this.data.selectAnswer;
    console.log(v)
    if (obj.answer == this.data.word.China) {
      selectAnswer[obj.id] = 1;
    } else {
      selectAnswer[obj.id] = 2;
    }
    this.setData({
      selectAnswer
    })
    console.log(this.data.selectAnswer)
  },
  keyboard() {
    let letterPos = this.data.word.eliminate;
    let english = this.data.word.english;
    this.setData({
      nineLetters: keyboard(letterPos, english)
    })
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