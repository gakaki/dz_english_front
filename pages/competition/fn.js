import { Word,words } from '../../sheets.js'
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';


 //加载英文单词
function loadEnglishWords(words) { 
    if(!words) {return}
    let englishWords = [];
    englishWords = words.map((v) => {
      let obj = Word.Get(v.id);
      let cloneObj = Object.assign({}, obj.cfg);
      cloneObj.type = v.type;
      // cloneObj.type = 4;
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
function keyboard(letterPos, english){  
  if (!letterPos) {
    return
  }
  if (!english) {
    return
  }
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
  if (!english) {
    return
  }
  let pos = [];
  let idx = english.length;
  while(--idx > -1) {
    pos.push(idx);
  }
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

//每回合的中文名字
function getRoundType(v) {
  console.log(v)
  let typeName = null;
  switch (v) {
    case 1:
    case 2:
      typeName = '翻译';
      break;
    case 3:
      typeName = '翻牌';
      break;
    case 4:
      typeName = '拼写';
      break;
  }
  return typeName
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


function getOptions(question, type){
  let v = [];
  if(type == 'chinese') {
    v = question.errorWords.map(v=>{
      return v.chinese
    })
    v.push(question.chinese)
  } else {
    v = question.errorWords.map(v => {
      return v.english
    })
    v.push(question.english)
  }
  return v.sort((a, b) => { return Math.random() - 0.5 });
}

function getChineneOptions(question) {
  let arr = getOptions(question, 'chinese');
  // arr = ['向上；上升；在……上面', '为；代替；因为；为得到', '面具；遮蔽物；口罩；面具；遮蔽物；口罩','面具；遮蔽物；口罩']
  arr = arr.map((v)=>{
    return v.split('；')
  })
  return arr
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
  calculateScore,
  getRoundType
}
