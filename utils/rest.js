const srv = "https://h5.ddz2018.com/";
// const wss = "wss://hws.ddz2018.com/json";
const CODE_SUC = 0;
const APPNAME = 'english';
let sid, uid, app;

function doFetch(action, data, suc, err) {
  data = data || {};
  if (!sid) {
    sid = wx.getStorageSync('_sid');
  }
  if (sid) {
    data._sid = sid;
  }
  if (uid) {
    data.uid = uid;
  }
  data.appname = APPNAME;

  data.action = action;

  wx.request({
    url: srv,
    data: data,
    success: function (res) {
      suc(res.data)
    },
    fail: err
  })
}

function sdkAuth(code, suc) {
  doFetch("user.auth", {
    payload: { code }
  }, res => {
    uid = res.data.uid;
    wx.setStorageSync('uid', uid);
    userLogin(suc, showErr);
  })
}

function userLogin(suc, err) {
  wx.getUserInfo({
    success: info => {
      app = getApp();
      app.globalData.userInfo = info.userInfo;
      app.globalData.hasUserInfo = true;
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(info)
      }

      doFetch('user.login', { info: info.userInfo }, res => {
        if (res.code != CODE_SUC) {
          err(res.code);
        }
        else {
          res = res.data;
          wx.setStorageSync('_sid', res.sid);
          sid = res.sid;
          suc(res)

        }
      }, err);
    },
    fail() {
      app = getApp();
      app.globalData.hasUserInfo = false;
    }
  })
}

function getUid() {
  if(uid) {
    return uid
  } else {
    return wx.getStorageSync('uid');
  }
}

//向下取整并保留两位小数；
function fixedNum(num) {
  //此处不用四舍五入为了防止钱会多出的情况
  let str = Math.floor(num * 100) / 100;
  let v = str.toString().split(".");
  if (v[1] == undefined) {
    str = v[0]+'.00'
  }
  else if(v[1].length == 1){
    str = str+'0'
  }
  return str
}

const showErr = msg => {
  wx.showToast({
    title: '哎呀,' + msg,
  })
}


class LsnNode {
  constructor(action, cb, ctx) {
    this.action = action;
    this.cb = cb;
    this.ctx = ctx;
    this.id = cb.name + "_" + (ctx.name || ctx.route);
  }
}




//启动（会默认走一遍登录流程）
const start = suc => {
  wx.checkSession({
    success: () => {
      userLogin(suc, showErr);
    },
    fail:res=>{
      wx.login({
        success: res => {
          sdkAuth(res.code, suc)
        }
      })
    }
  })
}

module.exports = {
  start,
  showErr,
  doFetch,
  getUid,
  fixedNum
}