const sheet = require('../sheets.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function care (obj, key, cb) {
  if (obj.__pKeys && obj.__pKeys.has(key)) {
    obj.__pKeys.get(key).add(cb);
  }
  else {
    obj.__pKeys = obj.__pKeys || new Map();
    if (!obj.__pKeys.has(key)) {
      obj.__pKeys.set(key, new Set());
    }
    obj.__pKeys.get(key).add(cb);

    let d = Object.getOwnPropertyDescriptor(obj, key)

    d.ctx = d.ctx || obj;

    // let oget,oset;
    d._funGet = ()=>{
      if (d._oget) {
        return d._oget();
      }
      else{
        return d.value;
      }
    };

    d._funSet = (v)=>{
      if (d._oset) {
        d._oset(v);
      }
      else{
        d.value = v;
      }
      d.ctx.__pKeys.get(key).forEach(c => {
        c(v);
      })
    };

    if (d.set || d.get) {
      //already has descriptor get or set
      d._oset = d.set;
      d._oget = d.get;
      d.get = d._funGet;
      d.set = d._funSet;
      if (!d.configurable) {
        console.error('cannot proxy a unConfigurable key')
        return;
      }
      Object.defineProperty(obj, key, d)
    }
    else {
      //need define
      d = {
        get:d._funGet,
        set:d._funSet,
        ctx:obj
      };
      Object.defineProperty(obj, key, d);
    }
    
  }

  
}

const delay = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

class Timeline {
  constructor(delay, cb, ctx, autoStart = false){
    this.delay = delay;
    this.cb = cb;
    this.ctx = ctx;
    this.preve = null;
    this.next = null;
    this.started = false;
    this.finished = false;

    autoStart && this.start();
    
  }

  get root() {
    let _root = this;
    while(_root.preve) {
      _root = _root.preve;
    }
    return _root;
  }

  get last() {
    let _last = this;
    while(_last.next) {
      _last = _last.next;
    }
    return _last;
  }

  start() {
    let startNode = this;

    while(startNode.preve && !startNode.preve.started) {
      startNode = startNode.preve;
    }

    if (startNode != this) {
      startNode.start();
    }
    else {
      this.tmr = setTimeout(()=>{this.finishCall()}, this.delay);
      this.started = true;
    }

    return this;
  }

  finishCall(callFinishCb = true, startNext = true) {
    if (this.tmr) {
      clearTimeout(this.tmr);
      this.tmr = null;
    }
    if (!this.finished && callFinishCb ) {
      this.ctx ? this.cb.call(this.ctx) : this.cb();
    }

    this.finished = true;

    //chain
    if (this.next && this.next instanceof Timeline) {
      if (startNext)
        this.next.start();
    }
  }


  add(time, cb, ctx) {
    let tm = Timeline.add(time, cb, ctx);
    tm.preve = this;
    this.next = tm;
    return tm;
  }

  stop() {
    if (this.tmr) {
      //self not finished
      this.finishCall(false, false);

    }
    else {
      //self finished, find next 
      if (this.next && this.next instanceof Timeline) {
        this.next.stop();
      }
    }
    return this;
  }

  static add(time, cb, ctx) {
    return new Timeline(time, cb, ctx);
  }

  /**
  * @param tm 要停止的timeline,
  * 注意：stop不会调用timeline链路上尚未完成结点的回调函数！！
  */
  static stop(tm) {
    tm.root.stop();
  }

  /**
  * @param tm 要停止的timeline
  * 注意：finish会调用一次timeline链的最后一个结点上的回调函数（如果它已经被调用过，则不再重复调用）!!
  */
  static finish(tm) {
    this.stop(tm);
    tm.last.finishCall(true, false);
  }
}
function getRankFrame(season) {
  let idx = 0
  for (let i in season) {
    idx++
  }
  if (idx == 1) {
    console.log(season[idx].rank)
    return ''
  }
  if (idx > 1) {
    let i = idx - 1
    if (parseInt(season[i].rank) <= 6) {
      return ''
    } else return sheet.Stage.Get(season[i].rank).frame
  }
}
function getPersonFrame(rank) {
    if (parseInt(rank) <= 6) {
      return ''
    } else return sheet.Stage.Get(parseInt(rank)).frame
}
module.exports = {
  getRankFrame: getRankFrame,
  formatTime: formatTime,
  care : care,
  Timeline:Timeline,
  getPersonFrame: getPersonFrame
}
