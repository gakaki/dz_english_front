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
    console.log('has cared',key)
    obj.__pKeys.get(key).add(cb);
  }
  else {
    obj.__pKeys = obj.__pKeys || new Map();
    if (!obj.__pKeys.has(key)) {
      obj.__pKeys.set(key, new Set());
    }
    obj.__pKeys.get(key).add(cb);

    let d = Object.getOwnPropertyDescriptor(obj, key)
    console.log('care key', key, d)
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


module.exports = {
  formatTime: formatTime,
  care : care
}
