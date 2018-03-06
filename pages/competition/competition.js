// pages/competition/competition.js

import { Word } from '../../sheets.js'
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
import { loadEnglishWords, keyboard, getRoundName, hideLettersArr, randomHideLetters, changeArrAllValue, englishSelector, quanpinKeyboard} from './fn.js'

let roundLimit = 4;
let timer = null;
const totalCountTime = 10;
const roundTotalScore = 200;
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
    hideLetters: [false,false,false,false,false], //要隐藏的字母
    hideAllLetters: false, //隐藏所有字母
    englishWords: [],
    showIndex:0,  //显示顺序
    titleIndex: 0, //单词是第几题 
    rotateList: [true, true, true, true, true, true, true, true, true], //true为正面，false为背面
    time:2000,
    backClickCount:0,
    answer:0, //0不显示正确和错误按钮，1表示正确，2表示错误
    round:1,
    roundName:null,
    selectAnswer:[0,0,0,0],  //0为未选择，1为正确，2为错误
    firstClick:true,
    clockStart: false,
    clockTime: totalCountTime, //倒计时时间
    myScore:0
  },
  onReady() {
    loadEnglishWords((englishWords)=>{
      this.setData({
        englishWords
      })
      this.roundInit()
    });
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
      backClickCount: 0,
      clockTime: totalCountTime,
      selectAnswer: [0, 0, 0, 0],
      firstClick:true,
      hideLetters:[false,false,false,false,false]
    })
    let word = this.data.word;
    let letters = word.english.split('');
    console.log(this.data.hideLetters,'hideLetters')
    this.setData({ letters})
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
          hideLetters
        })
        this.playOne();
        break;
      case 2:
        this.playTwo();
        break;
      case 3:
        this.playThree();
        break;  
      case 4:
        this.playFour();
        break;  
    }
    
  },
  playOne() {   //翻牌
    this.keyboard(); //渲染九宫格键盘
    var timerCount = 0;
    timerCount = setTimeout(() => {
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
        case 2:
          let letterPos = this.data.word.eliminate;
          let hideLetters = this.data.hideLetters;
            //擦去部分字母
          letterPos.forEach((v) => {
            hideLetters[v] = true
          })
          this.setData({
            hideLetters,
            time: 1000
          })
          break;
        case 3:  //显示九宫格
          this.setData({
            time: 3000
          })
          break;
        case 4:
          this.setData({
            rotateList: changeArrAllValue(this.data.rotateList, false),
            time: 2000,
          })
          setTimeout(() => {
            this.countClockTime()
          }, 500)

          break;
      }
      clearInterval(timerCount);
      if (this.data.showIndex < 4) {
        this.playOne();
      }
    }, this.data.time);
  },
  playTwo() {  //英译中
    var timerCount = 0;
    timerCount = setTimeout(() => {
      this.setData({
        showIndex: this.data.showIndex + 1
      })
      let type = this.data.word.type;
      switch (this.data.showIndex) {
        case 1:  
          this.setData({
            time: 2000
          })
          setTimeout(() => {
            this.audioCtx.play()
          }, 1000)
          break;
        case 2:
          let letterPos = this.data.word.eliminate;
          let hideLetters = this.data.hideLetters;
            this.setData({
              hideLetters,
              time: 1000
            }) 
          this.countClockTime();
          break;
      }
      clearInterval(timerCount);
      if (this.data.showIndex < 2) {
        this.playTwo();
      }
    }, this.data.time);
  },
  playThree() {  //中译英
    var timerCount = 0;
    timerCount = setTimeout(() => {
      this.setData({
        showIndex: this.data.showIndex + 1
      })
      let type = this.data.word.type;
      switch (this.data.showIndex) {
        case 1:  //显示完整单词
          this.setData({
            time: 2000
          })
          setTimeout(() => {
            this.audioCtx.play()
          }, 1000)
          break;
        case 2:
          let word = this.data.word;
          word.options = englishSelector(word.english)
          console.log(word)
          this.setData({
            word
          })
          setTimeout(() => {
            this.countClockTime()
          }, 500)
          break;
      }
      clearInterval(timerCount);
      if (this.data.showIndex < 2) {
        this.playThree();
      }
    }, this.data.time);
  },
  playFour() { //单词拼写
    // quanpinKeyboard(this.data.letters); //渲染全拼九宫格键盘
    var timerCount = 0;
    timerCount = setTimeout(() => {
      this.setData({
        showIndex: this.data.showIndex + 1
      })
      let type = this.data.word.type;
      switch (this.data.showIndex) {
        case 1:  //显示完整单词
          this.setData({
            time: 2000
          })
          setTimeout(() => {
            this.audioCtx.play()
          }, 1000)
          break;
        case 2:
          let hideLetters = this.data.hideLetters;
          //擦去部分字母
          hideLetters.forEach( (v,i) => {
            hideLetters[i] = true
          })
          this.setData({
            hideLetters,
            time: 1000
          })
          break;
        case 3:
          this.countClockTime()
          
          break;
      }
      clearInterval(timerCount);
      if (this.data.showIndex < 3) {
        this.playFour();
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
      let rotateList = this.data.rotateList;  //翻牌的列表
      rotateList[i] = true
      this.setData({
        rotateList, 
        backClickCount: bcCount+1,
        letters,
        hideLetters,
        myScore: 0,
        otherScore: 0
      })
      if (bcCount == bcLimit - 1) {
        let word = letters.join('');
        let answer = 0;
        console.log(letters,word,this.data.word.english)
        if(word == this.data.word.english) {
          answer = 1;
          this.setData({
            myScore: this.data.clockTime * 20
          })
        } else {
          answer = 2
        }
        this.setData({
          answer
        })
        this.restart()  //暂时放在这里，对局中，如果收到对家数据，这展示答案，重新开始
      }
    }
  },
  selectAnswer(v) {
    if (this.data.firstClick) {
      let obj = v.currentTarget.dataset;
      let selectAnswer = this.data.selectAnswer;

      if (obj.answer == this.data.word.China || obj.answer == this.data.word.english) {
        selectAnswer[obj.id] = 1;
        this.setData({
          myScore: this.data.clockTime * 20
        })
      } else {
        selectAnswer[obj.id] = 2;
      }

      this.setData({
        selectAnswer,
        firstClick: false
      })
      this.restart()
    }

  },
  restart(){
    clearInterval(timer)
    setTimeout(() => {
      this.setData({
        clockStart: false,
        round: this.data.round + 1
      })
    }, 500)
    setTimeout(() => {
      if (this.data.round < roundLimit) {
        this.roundInit()
      } else {
        console.log('结束')
      }
    }, 3000)
  },
  countClockTime(){
    timer = setInterval(()=>{
      this.setData({
        clockStart: true,
        clockTime: this.data.clockTime - 1
      })
      if (this.data.clockTime <= 0) {
        this.setData({
          answer: 2,
        })
        this.restart()
        clearInterval(timer)
      }
    },1000)
    
  },
  keyboard() {
    let letterPos = this.data.word.eliminate;
    let english = this.data.word.english;
    console.log(letterPos,english)
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