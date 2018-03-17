// pages/competition/competition.js
const app = getApp()
import { Word } from '../../sheets.js'
import { Timeline } from '../../utils/util.js'
import { doFetch, wsSend, wsReceive, getUid, wsClose, shareSuc, checkoutIsRoom} from '../../utils/rest.js';
import {  getRoomInfo, keyboard, getRoundName, hideLettersArr, randomHideLetters, changeArrAllValue, getEnglishOptions, getChineneOptions, quanpinKeyboard, calculateScore} from './fn.js'

let roundLimit = 5;
const totalCountTime = 10;
const roundTotalScore = 200;
let end = false;  //当前动画显示是否完成
let timer = null;//当前题目的10秒倒计时句柄
let tm;//Timeline//当前题目操作时间线
let question;//当前题目
let options;//当前题目答案项
let rightAnswer;//当前题目的正确答案
let answerSend;//当前题，答案是否已发给后端 
let isRight;//当前题是否答对了
let rid;//房间id
let round, totalScore; //round第几回合，从1开始 //本人总分
let canClick = false; //9宫格是否可以点击
let pkEnd = false

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:null,
    rid:null,
    userLeft:{},//左边玩家信息
    userRight:{},//右边玩家信息
    nineLetters: [], //九宫格字母
    bgIndex: [false, false, false, false, false, false, false, false, false], //第几个点击，更改背景色
    word: {},
    chinese:[],
    rightAnswer: '',//正确答案
    options:[],//答案选项
    letters: [],  //单词变成字母
    hideLetters: [false,false,false,false,false], //要隐藏的字母
    englishWords: [],
    rotateList: [true, true, true, true, true, true, true, true, true], //true为正面，false为背面
    backClickCount:0,
    answer:0, //0不显示正确和错误按钮，1表示正确，2表示错误
    selectAnswer:[0,0,0,0],  //0为未选择，1为正确，2为错误
    clockStart: false,
    clockTime: totalCountTime, //倒计时时间
    myScore:0,  //当前自己本轮得分
    otherScore:0,  //他人总分
    totalScore:0,
    roundIsRight:false,
    roundAnswer:{},
    //mc
    startMcResPrefix: 'dz_bg_',
    startMcResStartIdx: 1,
    startMcResEndIdx: 7,
    startMcResPrefix2: 'dz_word_',
    startMcResStartIdx2: 1,
    startMcResEndIdx2: 7,
    startMc1:true,
    startMc2:true,
    starMcWd1: 704,
    starMcHt1: 73,
    starMcWd2: 749,
    starMcHt2: 275,
    showMask: false,
    maskPos:0,
    isFriend:false

  },
  onLoad(options) {
    pkEnd = false;
    rid = options.rid;
    round = 1;
    totalScore = 0;
    if(options.isFriend) {
      this.setData({
        isFriend: options.isFriend
      })
    }

    getRoomInfo(rid, res => {
      if (res.code) {
        wx.showToast({
          title: '出错了',
        })
      }
      else {
        let userLeft, userRight;
        let [u1,u2] = res.data.userList;
        //进这个页面时，自己是对战方之一
        if (u1.info.uid == getUid()) {
          userLeft = u1.info;
          if(u2 && u2.info) {
            userRight = u2.info;
          }
          
        }
        else {
          if (u2 && u2.info) {
            userLeft = u2.info;
          }
          userRight = u1.info;
        }
        app.globalData.userInfo = userLeft;
        
        //更新数据 
        this.setData({
          userLeft,
          userRight,
          englishWords: res.data.roomInfo.wordList
        })

        //监听每局结束
        this.onRoundEndInfo();        

        //监听全局结束
        this.onPkEndInfo();

      }
    });

  },

  mcStopped(){

    tm = Timeline.add(1000, ()=>{
      //移除开始动画
      this.setData({
        startMc1:false,
        startMc2:false
      });

      //开始对战
      this.roundInit();
    }).start();
  },


  onUnload() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    if (prevPage.data.starAnimation) {
      prevPage.setData({
        fromIndex: true,
        starAnimation: ''
      })
    }
    answerSend = true;
    this.tagRoundEnd(true);
    
    if (!pkEnd) {
      wsSend('leaveroom', { rid: rid })
    }
    wsClose(['roundEndSettlement', 'nextRound', 'pkEndSettlement', 'roomInfo', 'pkInfo']);
   
  },
  onHide(){
    checkoutIsRoom(rid)
  },
  onShow: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioTrue = wx.createAudioContext('true')
    this.audioFalse = wx.createAudioContext('false')
    this.audioSelect = wx.createAudioContext('select')
    
  },
  roundInit(){
    answerSend = false;
    canClick = false;
    if (round > this.data.englishWords.length) {
      return;
    }
    let idx = round - 1;
    question = this.data.englishWords[idx];
    //清理上一局数据
    this.setData({
      title:null,
      options:null,
      word:{},
      letters:[],
      answer: 0,
      roundIsRight:false,
      hideLetters:[],
      nineLetters:[],
      rotateList: changeArrAllValue(this.data.rotateList, true),
      bgIndex: changeArrAllValue(this.data.bgIndex, false),
      
      selectAnswer: [0, 0, 0, 0],
      backClickCount:0,
      roundAnswer:{},
      clockTime: 10,
      chinese:[]
    })


    //开始对应玩法
    switch(question.type) {
      case 1:
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

  tagRoundEnd(stopClock = true) {
    canClick = false;
    if (tm) {
      Timeline.stop(tm);
      tm = null;
    }
    if (timer && stopClock) {
      clearInterval(timer);
      timer = null;
    }
    let answer = this.data.answer;
    let roundIsRight = this.data.roundIsRight;

    if (!answer) {
      answer = 2;//未设置过对错的话，认为是时间到了，设置为错
      roundIsRight = false;
      let roundAnswer = {}
      roundAnswer['not_select'] = false;
      this.setData({
        answer,
        roundIsRight,
        roundAnswer
      })
    }

    if (!answerSend) {
      //通知后端，一题完成
      canClick = false;
      if(round > 5) {return}
      if(!this.data.word) {return}
      wsSend('roundend', {
        rid: rid,
        wid: this.data.word.id,
        type: this.data.word.type,
        time: round,
        round: round,
        score: this.data.myScore,
        totalScore,
        clockTime:this.data.clockTime,
        isRight: this.data.roundIsRight,
        answer: this.data.roundAnswer
      });
      answerSend = true;
      
    }

  },

  onRoundEndInfo() {
    wsReceive('roundEndSettlement', res => {
      if(pkEnd) {return}
      if (res.code) {
        wx.showToast({
          title: '本题结算出错'
        })
      }
      else {
        let ulist = res.data.userList;
        let userLeft = this.data.userLeft;
        let userRight = this.data.userRight;
        
        let [u1, u2] = ulist;
        let resultLeft, resultRight;

        if (userLeft.uid == u1.info.uid) {
          resultLeft = u1;
          resultRight = u2;
        }
        else{
          resultLeft = u2;
          resultRight = u1;
        }

        //resultLeft/resultRight: {info:player, scrore:number, continuousRight:number, playerAnswer:[{letterOrChoice:true/false}]}
        //展示对局答案信息，
        this.setData({otherScore: resultRight.score||0, otherAnswer: resultRight.playerAnswer||{}});
      }
    })
    //开始下一题
    wsReceive('nextRound', res => {
      if(pkEnd) {return}
      if(res.data.round - round != 1) {
        return
      }
      round++;
      this.tagRoundEnd(true);
      this.setData({ clockStart: false });
      tm = Timeline.add(1500, this.roundInit, this).start();
    })
  },

  onPkEndInfo() {
    wsReceive('pkEndSettlement', res => {
      if (res.code) {
        wx.showToast({
          title: '结算出错了'
        })
      }
      else {
        pkEnd = true;
        let data = res.data;
        let isFriend = data.isFriend;
        let final = data.final;
        let gold = data.gold;
        let exp = data.exp;

        let userLeft = this.data.userLeft;
        let userRight = this.data.userRight;
        let [u1, u2] = data.userList;
        let resultLeft, resultRight;

        if (userLeft.uid == u1.info.uid) {
          resultLeft = u1;
          resultRight = u2;
        }
        else{
          resultLeft = u2;
          resultRight = u1;
        }
        //resultLeft/resultRight: {info:player, score:number, continuousRight:number}, final:number//0:失败，1平局 2胜利, changeInfo: isRank: {isRank:isRank,rank:rank},isStarUp: {isStarUp:isStarUp,},isUp: {isUp:isUp,level:level}}
        app.globalData.pkResult = {resultLeft,resultRight, changeInfo:data.pkResult, final, isFriend, exp, gold};
        let isUp = data.pkResult.isUp;
        
        let show = isUp.isUp;
        let level = isUp.level;
        let url = '';
        if (isUp.awards) {
          let k = isUp.awards.k;
          let v = isUp.awards.v;
          url = '&show=' + show + '&level=' + level + '&k=' + k + '&v=' + v + '&rid=' + rid + '&otherLeave=' + res.data.isLeave
        } else {
          url = '&show=' + show + '&rid=' + rid + '&otherLeave=' + res.data.isLeave
        }
        this.tagRoundEnd(true);
        wx.redirectTo({
          url: '../result/result?' + url
        })
      }
    })
  },
  //显示第几题
  showQuestionIdx(){
    this.setData({title: getRoundName(round)})
  },
  audioPlay(){
    this.audioCtx.play()
  },
  //显示题目
  showQuestion(){
    let title = null;//隐藏‘第X题’
    let letters = question.english.split('');
    this.setData({
      title: title,
      word: question,
      letters,
      rightAnswer: rightAnswer
    })
    this.setData({
      chinese: this.data.word.chinese.split(';')
    })
  },
  hideQuestionLetter(hideAll = false){
    let letterPos = question.eliminate;
    let randomPos = letterPos[0] == -1;//随机扣掉字母
    if (randomPos) {
      letterPos = []
    }
    let hideLetters = rightAnswer.split('').map((v, idx) => {
      if (hideAll) {
        return true;
      }
      if (randomPos) {
        let toHide = Math.random() > 0.5;
        if (toHide) {
          letterPos.push(idx)
          question.eliminate = letterPos;
        }
        
        return toHide;
      }
      else if (letterPos.indexOf(idx) > -1) {
        return true;
      }
      return false;
    });

      //擦去部分字母
    this.setData({ hideLetters, letterPos});
  },
  //显示九宫格
  showNineCard() {

  },
  //翻转九宫格至字母不可见
  flipNineCard() {
    let rotateList = this.data.rotateList.map(v=> false);
    this.setData({rotateList});
  }, 
  showChineseOptions(){
    options = getChineneOptions(question);
    this.setData({options})
  },
  showEnglishOptions(){
    options = getEnglishOptions(question);
    this.setData({options})
  },
  playtoQuestion(answerKey){
    rightAnswer = question[answerKey];//设置正确答案内容
    tm = Timeline.add(200, this.showQuestionIdx, this)//显示第几题
    .add(2000, this.showQuestion, this)//显示题目单词
    return tm;
  },
  //英译中，选项方式
  playOne() { 
    //new----------------
    this.playtoQuestion('chinese')
    .add(1000, this.audioPlay, this)
    .add(500, this.showChineseOptions, this)
    .add(0, this.countClockTime, this)
    .add(10000, this.tagRoundEnd, this)
    .start();

    
  },
  //中译英，选项方式
  playTwo() {
    this.playtoQuestion('english')
    .add(1000, this.audioPlay, this)
    .add(500, this.showEnglishOptions, this)
    .add(0, this.countClockTime, this)
    .add(10000, this.tagRoundEnd, this)
    .start();
  },
  //翻牌
  playThree() {
    //new ----------
    this.playtoQuestion('english')
    .add(1000, this.audioPlay, this)//3秒后，播放音频
    .add(3000, this.hideQuestionLetter, this)//1秒后，擦去部分字母
    .add(1000, this.keyboard, this)//渲染九宫格键盘
    .add(3000, this.flipNineCard, this)//翻转九宫格键盘至字母不可见
    .add(0, this.countClockTime, this)//开始时钟倒计时
    .add(10000, this.tagRoundEnd, this)//10秒后，客户端认为此局结束（通常在此之前服务器已经通知客户端真正结束)
    .start();//timeline开始运行
    ///-------------
  },
  //单词拼写
  playFour() { 
    this.playtoQuestion('english')
    .add(0, this.hideAllLetters, this)//隐藏文字
    .add(1000, this.audioPlay, this)//1秒后，播放音频
    .add(1000, this.showInputKeyboard, this)//渲染全拼九宫格键盘
    .add(0, this.countClockTime, this)
    .add(10000, this.tagRoundEnd, this)
    .start();

  },

  //擦去全部字母
  hideAllLetters(){
    this.hideQuestionLetter(true);
  },
  //渲染全拼九宫格键盘
  showInputKeyboard(){
    this.setData({
      nineLetters: quanpinKeyboard(rightAnswer)  
    }); 
  },
  showFront(v){  //点击翻牌
    if (!canClick) return;

    let obj = v.currentTarget.dataset;
    let bgIndex = this.data.bgIndex;
    if (bgIndex[obj.index]) {
      return;//已经点过这个键了
    }
    bgIndex[obj.index] = true;
    
    let bcCount = this.data.backClickCount;
    let bcLimit = question.eliminate.length;
    let letters = this.data.letters;
    if (bcCount < bcLimit) {
      let i = v.currentTarget.dataset.index; //点击的第几个牌面
      let inner = v.currentTarget.dataset.inner;  //牌面对应的字母
      let letterPos = question.eliminate;  //要隐藏的字母位置
      let hideLetters = this.data.hideLetters;  //对应的字母位置是否要隐藏
      let index = letterPos[bcCount];   //第几次点击对应的字母位置
      let answer = this.data.answer;

      hideLetters[index] = false;  //将该位子的背面转成正面
      letters[index] = inner;   //正面的字母显示到上面
      let rotateList = this.data.rotateList;  //翻牌的列表
      rotateList[i] = true;
      isRight = false;

      this.setData({
        rotateList, 
        backClickCount: bcCount+1,
        letters,
        hideLetters
      })

      if (bcCount == bcLimit - 1) {
        let word = letters.join('');
        answer = 0;
        let myScore = 0;

        if(word == rightAnswer) {
          answer = 1;
          isRight = true;
          myScore = calculateScore(this.data.clockTime, round, this.data.word.speech, this.data.userLeft.character.developSystem)
          totalScore = totalScore + myScore;
          this.playResultAudio(isRight)
        } 
        else {
          answer = 2;
          this.playResultAudio(isRight);
          this.failSelect();
          
        }


        let roundAnswer = {}
        roundAnswer[word] = isRight;
        this.setData({
          myScore,
          answer,
          roundIsRight: isRight,
          totalScore,
          roundAnswer
        })
        this.tagRoundEnd(false);
      } else {
        this.selectPlay()
      }
    }
  },
  selectPlay(){
    if (!wx.getStorageSync('music')) {
      this.audioSelect.play();
    }
  },
  chooseLetter(e) {
    if(!canClick) return;
    let obj = e.currentTarget.dataset;
    let letter = this.data.nineLetters[obj.index];

    let bgIndex = this.data.bgIndex;
    if (bgIndex[obj.index]) {
      return;//已经点过这个键了
    }
    bgIndex[obj.index] = true;

    let letters = this.data.letters;
    
    if (!letters.okCnt) {
      letters.okCnt = 0;
    }

    let myScore = 0;
    isRight = false;
    let finished = false;
    let hideLetters = this.data.hideLetters;
    let answer = this.data.answer;

    //只要点了其中一个正确的字母，就把该字母放到正确的位置上
    let idx = this.data.word.english.indexOf(letter);
    let ridx = this.data.word.english.lastIndexOf(letter);

    let sucIdx = -1;
    let str = rightAnswer;
    for(let i = 0; i < str.length; i++) {
      let s = str[i];
      if (s == letter) {
        if (hideLetters[i]) {
          hideLetters[i] = false;
          sucIdx = i;
          break;
        }

      }
    }

    if (sucIdx > -1) {
      letters[sucIdx] = letter;
      letters.okCnt++;
      if (letters.okCnt == letters.length) {
        //回答全部正确
        answer = 1;
        isRight = true;
        finished = true;
        myScore = calculateScore(this.data.clockTime, round, this.data.word.speech, this.data.userLeft.character.developSystem);
        totalScore = totalScore + myScore;

        this.playResultAudio(isRight)
     
      } else {
        this.selectPlay();
      }
    }
    else {
      //回答出错
      answer = 2;
      finished = true;
      this.playResultAudio(isRight);
      this.failSelect();
    }

    let roundAnswer = {};
    if (finished) {
      roundAnswer[letters.join()] = isRight;
    }


    this.setData({
      answer,
      letters,
      hideLetters,
      roundAnswer,
      myScore,
      totalScore,
      bgIndex,
      roundIsRight: isRight
    })

    if (finished) {
      this.tagRoundEnd(false);

    }
  },
  playResultAudio(isRight){
    if (!wx.getStorageSync('music')) {
      setTimeout(() => {
        isRight ? this.audioTrue.play() : this.audioFalse.play();
      }, 200)
    }
  },
  chooseOption(v) {  //选列选项点击
    if (!canClick) return;
      let obj = v.currentTarget.dataset;
      let myScore = 0;
      isRight = false;
      let answer = this.data.answer;
      let selectAnswer = this.data.selectAnswer;

      if (obj.answer == rightAnswer) {
        selectAnswer[obj.id] = 1;
        isRight = true;
        answer = 1;
        myScore = calculateScore(this.data.clockTime, round, this.data.word.speech, this.data.userLeft.character.developSystem);
        totalScore = totalScore + myScore;
        this.setData({
          myScore,
          totalScore
        })
      } else {
        answer = 2;
        selectAnswer[obj.id] = 2;
        this.failSelect();
      }

      this.playResultAudio(isRight)

      let roundAnswer = {};
      roundAnswer[obj.answer] = isRight;
      this.setData({
        answer,
        roundIsRight: isRight,
        selectAnswer,
        roundAnswer
      })
      canClick = false
      this.tagRoundEnd(false)
    

  },
  failSelect(){
    this.setData({
      showMask: true
    });
    setTimeout(()=>{
      this.setData({
        showMask: false
      });
    },100)
  },
  countClockTime(){
    canClick = true;
    if (timer) {
      clearInterval(timer);
    }
    this.setData({
      clockStart: true
    });

    timer = setInterval(()=> {
      let clockTime = this.data.clockTime - 1;
      if (clockTime <=0) {
        //倒计时结束 
        clearInterval(timer);
        this.setData({ clockStart:false });
      }
      this.setData({ clockTime});
    }, 1000);
    
  },
  //设置九宫格
  keyboard() {
    let letterPos = this.data.letterPos;
    let english = rightAnswer;
    this.setData({
      nineLetters: keyboard(letterPos, english)
    })
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