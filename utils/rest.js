const io = require('./index.js');
 const srv = "https://h5t.ddz2018.com/";
 const wss = "wss://h5t.ddz2018.com/english";
// const srv = "https://local.ddz2018.com/";
// const wss = "wss://local.ddz2018.com/english";
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
          // err(res.code);
          wx.clearStorageSync('_sid');
          wx.clearStorageSync('uid');
          wx.login({
            success: res => {
              isAuth = false;
              sdkAuth(res.code, suc)
            }
          })
        }
        else {
          res = res.data;
          wx.setStorageSync('_sid', res.sid);
          sid = res.sid;
          suc(res)
          wsInit();
          app.globalData.logined = true;
          doFetch('english.showpersonal', {}, (res) => {
            app.globalData.personalInfo = res.data;
           
            
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


function shareSuc() {
  doFetch('english.getshareaward',{},res=>{
    console.log(res.data,'分享成功')
  })
}


function wsReceive(action, suc) {
  socket.on(action, res => {
    console.log('wsR',action)
    suc(res)
  })
}
function wsSend(action, data) {
  console.log('ws',action)
  socket.emit(action, data)
}

function wsClose(actions) {
  if(Array.isArray(actions)) {
    actions.forEach(v=>{
      socket.removeAllListeners(v)
    })
  } else {
    socket.removeAllListeners(actions)
  }
  
}

function wsInit() {
  let url = wss + '?_sid=' + sid + '&appName=' + APPNAME + '&uid=' + uid;
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

  // wx.checkSession({
  //   success: () => {
  //     isAuth = true;
  //     userLogin(suc, showErr);
  //   },
  //   fail: res => {
  //     wx.login({
  //       success: res => {
  //         isAuth = false;
  //         sdkAuth(res.code, suc)
  //       }
  //     })
  //   }
  // })




   app = getApp()

  if (app.globalData.hasUserInfo) {
        suc();
    } else {
      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting) {
      //       if (!res.authSetting.scope.userInfo) {

      //       }
            
      //     }
      //   }
      // })
        wx.openSetting({
            success: res => {
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
        })
    }
}
const firstStart = suc => {
  app = getApp()

  if (app.globalData.hasUserInfo) {
    suc();
  } else {
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
}


module.exports = {
  start,
  showErr,
  doFetch,
  getUid,
  fixedNum,
  wsSend,
  wsReceive,
  wsClose,
  shareSuc,
  firstStart
}