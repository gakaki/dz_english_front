import { Word,words } from '../../sheets.js'
import { doFetch, wsSend, wsReceive } from '../../utils/rest.js';
const ALLLETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


 //加载英文单词
function loadEnglishWords(words) { 
 
    let englishWords = [];
    englishWords = words.map((v) => {
      let obj = Word.Get(v.id);
      let cloneObj = Object.assign({}, obj.cfg);
      cloneObj.type = v.type;
      cloneObj.english = cloneObj.english.trim();
      cloneObj.yinbiao = "['66666']";
      cloneObj.options = ['苹果', '橘子', '梨花', '花'];
      return cloneObj
    })
    return englishWords;

}

function getRoomInfo(rid, cb) {
  wsReceive('roomInfo',cb);//好友战的房间信息
  wsReceive('pkInfo',cb);//匹配战的房间信息

  wsSend('getroominfo', {
    rid: rid
  });
}

function quanpinKeyboard(letters) {
  let length = 9;
  let newArr = letters;
  for (let i = 0; newArr.length < length; i++) {
    let index = Math.floor(Math.random() * ALLLETTERS.length);
    let noDistinct = newArr.every(v => {
      return v !== ALLLETTERS[index]
    })
    if (noDistinct) {
      newArr.push(ALLLETTERS[index])
    }
  }
  newArr.sort((a, b) => {
    return Math.random() - 0.5
  })
  return newArr
}  

//设置九宫格键盘
function keyboard( letterPos, english){  
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

//设置英文选项列表
function englishSelector(word){
  let arr = autoSelect(words, 4, word);
  return arr
}

//随机选择几个英文单词 arr：待选词的数组，length想要的数组总长度，nowWord需要放入数组里面的东西
function autoSelect(arr, length,nowWord) {
  let newArr = [];
  nowWord && newArr.push(nowWord);
  for (let i = 0; newArr.length < length; i++) {
    let index = Math.floor(Math.random() * arr.length);

    let noDistinct = newArr.every((v,i)=>{
      return v.id !== arr[index].id
    })
    if (noDistinct) {
      newArr.push(arr[index].english)
    }
  }
  newArr.sort((a, b) => {
    return Math.random() - 0.5
  })
  return newArr;
}





module.exports = {
  loadEnglishWords,
  getRoomInfo,
  keyboard,
  getRoundName,
  hideLettersArr,
  randomHideLetters,
  changeArrAllValue,
  englishSelector,
  quanpinKeyboard
}
