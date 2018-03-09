const io = require('./index.js');

// const srv = "https://h5t.ddz2018.com/";
// const wss = "wss://h5t.ddz2018.com/english";
const srv = "https://local.ddz2018.com/";
const wss = "wss://local.ddz2018.com/english";

const care = require('./util.js');
const CODE_SUC = 0;
const APPNAME = 'english';
let sid, uid, app, isAuth = false;
let socketOpen = false;
let socketMsgQueue = [];
let socket;


function doFetch(action, data, suc, err) {
  data = data || {};
  console.log(isAuth, action)
  if (isAuth) {
    if (!sid) {
      sid = wx.getStorageSync('_sid');
    }
    if (sid) {
      data._sid = sid;
    }

  }
  if (!uid) {
    uid = wx.getStorageSync('uid');
  }
  if (uid) {
    data.uid = uid;
  }
  data.appName = APPNAME;
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
  doFetch("weChat.auth", {
    payload: { code },
    appName: APPNAME
  }, res => {
    uid = res.data.uid;
    wx.setStorageSync('uid', uid);
    userLogin(suc, showErr);
  },
    res => {
      console.log('error', res)
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
        isAuth = true;
        if (res.code != CODE_SUC) {
          err(res.code);
        }
        else {
          res = res.data;
          wx.setStorageSync('_sid', res.sid);
          sid = res.sid;
          suc(res)
          wsInit();
          app.globalData.logined = true
          doFetch('english.showpersonal', {}, (res) => {
            app.globalData.personalInfo = res.data;
            //console.log(Object.getOwnPropertyDescriptor(app.globalData, 'personalInfo').value)
            shareTo()
          })

        }
      }, err);

    },
    fail() {
      app = getApp();
      app.globalData.hasUserInfo = false;
    }
  })
}

function shareTo(){
  if (app.globalData.toFriend){
    doFetch('english.roomNotExist', {
      rid: app.globalData.friendRid
    }, (res) => {
      if (res.code == 0) {
        if (res.data.roomStatus == 1) {
          wx.navigateTo({
            url: '../friendPK/friendPK?rid=' + app.globalData.friendRid,
          })
        }
        else if (res.data.roomStatus == 2) {
          wx.navigateTo({
            url: '../competition/competition?rid=' + app.globalData.friendRid,
          })
        }
      }
      else {
        wx.showToast({
          title: '房间不存在',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
  else if (app.globalData.toRank){
    wx.navigateTo({
      url: '../rank/rank',
    })
    app.globalData.toRank = false
  }
  else if (app.globalData.toSelf){
    wx.navigateTo({
      url: '../self/self',
    })
    app.globalData.toSelf = false
  }
}


function wsReceive(action, suc) {
  socket.on(action, res => {
    suc(res)
  })
}
function wsSend(action, data) {
  socket.emit(action, data)
}


function wsInit() {
  console.log(sid, 'sid')
  let url = wss + '?_sid=' + sid + '&appName=' + APPNAME;
  socket = io(url);
  socket.on('connect', () => {
    console.log('#connect');
    //wsSend('ranking')
    // wsReceive('roomInfo', res => {
    //   console.log(res)
    // })
    // wsSend('joinroom', {
    //   rid: "111111"
    // })
    // wsReceive('roomInfo', res => {
    //   console.log(res)
    // })
    // setTimeout(function () {
    //   wsSend('leaveroom', {
    //     rid: "111111"
    //   }, 2000)
    // })
    // wsReceive('dissolve', res => {
    //   console.log(res)
    // })
    socket.on('disconnect', msg => {
      console.log('#disconnect', msg);
    });

    socket.on('disconnecting', () => {
      console.log('#disconnecting');
    });

    socket.on('error', () => {
      console.log('#error');
    });
  })

}

function getUid() {
  if (uid) {
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
    str = v[0] + '.00'
  }
  else if (v[1].length == 1) {
    str = str + '0'
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
      isAuth = true;
      userLogin(suc, showErr);
    },
    fail: res => {
      wx.login({
        success: res => {
          isAuth = false;
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
  fixedNum,
  wsSend,
  wsReceive
}