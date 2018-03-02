import { Word } from '../../sheets.js'
const ALLLETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function loadEnglishWords() {  //加载英文单词
  let ids = [{
    type:1,
    id:1
  }, {
    type: 2,
    id: 2
    }, {
      type: 3,
      id: 3
  }, {
    type: 4,
    id: 4
    }, {
      type: 2,
      id: 2
    }, ]
  let englishWords = [];
  englishWords = ids.map((v) => {
    let obj = Word.Get(v.id);
    let cloneObj = Object.assign({},obj.cfg);
    cloneObj.type = v.type;
    cloneObj.yinbiao = _getPhoneticSymbol();
    return cloneObj
  })
  return englishWords
}


function keyboard( letterPos, english){  //设置九宫格键盘
  let nineLetters = [];
  for (let i = 0; i < letterPos.length; i++) {
    nineLetters.push(english.charAt(letterPos[i]))
  }
  (function addLetter() {
    let i = Math.floor(Math.random() * 26);
    nineLetters.push(ALLLETTERS[i]);
    nineLetters = [...new Set(nineLetters)];
    if (nineLetters.length < 9) {
      addLetter()
    }
  })()
  nineLetters = nineLetters.sort(() => {
    return Math.random() - 0.5
  });
  return nineLetters
}

function getRoundName(v) {  //每回合的中文名字
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

function hideLettersArr(length){  //生成指定长度全部是false的数组
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


//获取对应音标
function _getPhoneticSymbol(english) {
  let ps = '[abc]';

  return ps;
} 

module.exports = {
  loadEnglishWords,
  keyboard,
  getRoundName,
  hideLettersArr,
  randomHideLetters
}
