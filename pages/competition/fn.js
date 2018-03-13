import { Word,words } from '../../sheets.js'
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';


 //加载英文单词
function loadEnglishWords(words) { 

    let englishWords = [];
    englishWords = words.map((v) => {
      let obj = Word.Get(v.id);
      let cloneObj = Object.assign({}, obj.cfg);
      // cloneObj.type = v.type;
      cloneObj.type = 4;
      cloneObj.english = cloneObj.english.trim();
      cloneObj.China = cloneObj.China.trim();
      return cloneObj
    })
    return englishWords;

}

function getRoomInfo(rid, cb) {
  wsReceive('roomInfo',cb);//好友战的房间信息
  wsReceive('pkInfo',cb);//匹配战的房间信息

  wsSend('getpkinfo', {
    rid: rid
  });
}

//设置九宫格键盘
function keyboard( letterPos, english){  
  let st = new Set();
  let cnt = 9 - letterPos.length;

  while(st.size < cnt) {
    let str = String.fromCharCode(Math.floor(Math.random()*26 + 97));
    
    if (english.indexOf(str) == -1) {
      st.add(str)
    }
  }
  let posStrs = letterPos.map((v) => {
    return english[v];
  })
  return Array.from(st).concat(posStrs).sort(() => { return Math.random() - 0.5 });

}

function quanpinKeyboard(english) {
  let pos = [];
  let idx = english.length;
  while(--idx > -1) {
    pos.push(idx);
  }
  console.log(english, pos, 'quanpinKeyboard_pos')
  return keyboard(pos, english);
}  
 //每回合的中文名字
function getRoundName(v) { 
  let title = null;
  switch (v) {
    case 1: 
      title = '第一题';
      break;
    case 2: 
      title = '第二题';
      break;
    case 3:
      title = '第三题';
      break;
    case 4:
      title = '第四题';
      break;
    case 5:
      title = '第五题';
      break; 
  }
  return title
}

//生成指定长度全部是false的数组
function hideLettersArr(length){  
  let arr = [];
  for(let i = 0;i<length;i++ ) {
    arr[i] = false
  }
  return arr
}

//指定类型为-1时，随机选择隐藏的字母
let newPos = [];
function randomHideLetters(length, eliminateNum) {
  let i = Math.floor(Math.random() * (length-2)) + 1;
  newPos.push(i);
  newPos = [...new Set(newPos)];
  if (newPos.length < eliminateNum) {
    randomHideLetters(length, eliminateNum)
  }
  newPos = newPos.sort((a,b)=>{
    return a - b;
  })
  return newPos
}

//改变数组所有的值
function changeArrAllValue(arr,v) {
  let arr2 = [];
  arr2 = arr.map(()=>{
    return v
  })
  return arr2;
}


function getOptions(question, key){
  let cnt = 0;
  let limit = 4;
  let start = Math.max(0, question.id - limit - limit);
  let end = Math.min(words.length, question.id + limit + limit);

  let arr = [question[key]];
  let ascend = Math.random() < 0.5;
  for(let i = ascend ? start:end; ascend ? i < end : i > start; ascend ? i++ : i--) {
    if (arr.length >= limit) {
      break;
    }
    let cfg = words[i];
    if (cfg.id == question.id) {
      continue;
    }

    if (cfg.difficult == question.difficult) {
      arr.push(cfg[key]);
    }
  }

  return arr.sort((a,b)=>{return Math.random() - 0.5});
}

function getChineneOptions(question) {
  return getOptions(question, 'China')
}

function getEnglishOptions(question) {
  return getOptions(question, 'english')
}

function calculateScore(countTime, round, type, addition){
  let nowPlus = 0;
  let nowScore;
 

  for (var v in addition) {
    if (addition[v].speech == type) {
      nowPlus = addition[v].plus
    }
  }
  if (round == 5) {
    nowScore = parseInt(countTime * 20 * 2 * (100 + nowPlus)/100);
  } else {
    nowScore = parseInt(countTime * 20 * (100 + nowPlus)/100);
  }
  return nowScore 
}


module.exports = {
  loadEnglishWords,
  getRoomInfo,
  keyboard,
  getRoundName,
  hideLettersArr,
  randomHideLetters,
  changeArrAllValue,
  quanpinKeyboard,
  getChineneOptions,
  getEnglishOptions,
  calculateScore
}
