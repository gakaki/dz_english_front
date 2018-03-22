const io = require('./index.js');
const srv = "https://h5t.ddz2018.com/";
const wss = "wss://h5t.ddz2018.com/english";
 //const srv = "https://local.ddz2018.com/";
 //const wss = "wss://local.ddz2018.com/english";
const care = require('./util.js');
const CODE_SUC = 0;
const APPNAME = 'english';
const APP = getApp();
let sid, uid, app, isAuth = false;
let socketOpen = false;
let socketMsgQueue = [];
let socket;
let allActions = [];
import { Constant } from '../sheets.js'


function doFetch(action, data, suc, err, _app) {
  // _fetchIntercept(action, _app)
  data = data || {};
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

function _fetchIntercept(action, _app) {

  let idx = null;
  let actionExisted = allActions.find((v, idx) => {
    if (v.action == action && _app) {
      _app.globalData.fetchIndex = idx
    }
    return v.action == action
  })

  if (actionExisted && _app) {
    let obj = allActions[_app.globalData.fetchIndex]
    let oldTime = obj.time;
    let diffTime = new Date() - oldTime;
    obj.time = new Date();
    if (diffTime < 2000) {
      return
    }
  } else {
    allActions.push({
      action: action,
      time: new Date()
    })
  }
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
    })
}

function userLogin(suc, err) {
  wx.getUserInfo({
    lang: 'zh_CN',
    success: info => {
      app = getApp();

      //如果用户城市不存在，就给其虚拟位置
      if (!info.userInfo.city) {
        let allPos = Constant.Get(3).value.split(',');
        let v = parseInt(Math.random() * allPos.length);
        info.userInfo.city = allPos[v]
      }
      
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
          // wsInit();
          app.globalData.logined = true;
          doFetch('english.showpersonal', {}, (res) => {
            app.globalData.personalInfo = res.data;
          })
          doFetch('weChat.minappreferrer', {
            referrerInfo: app.globalData.referrerInfo
          }, () => {  })
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
  doFetch('english.getshareaward', {}, res => {
  })
}


function wsReceive(action, suc) {
  socket.on(action, res => {
    suc(res)
  })
}
function wsSend(action, data) {
  socket.emit(action, data)
}

function wsClose(actions) {
  if (Array.isArray(actions)) {
    actions.forEach(v => {
      socket.removeAllListeners(v)
    })
  } else {
    socket.removeAllListeners(actions)
  }

}

function wsConnect(){
  sid = wx.getStorageSync('_sid');
  uid = wx.getStorageSync('uid');
  let url = wss + '?_sid=' + sid + '&appName=english' + '&uid=' + uid;
  if(!socket){
    socket = io(url, { forceNew:true});
  }
 
  socket.on('connect', () => {
    app.globalData.wsConnect = true;

    socket.on('disconnect', msg => {
      app.globalData.wsConnect = false;
    });

    socket.on('error', msg => {
      // app.globalData.wsConnect = false;
    });
  })

}

function wsClosed(){
  console.log('close')
  socket.close()
  wx.closeSocket()
  socket = null;
  app.globalData.wsConnect = false;
  
}


function wsInit() {
  let url = wss + '?_sid=' + sid + '&appName=' + APPNAME + '&uid=' + uid;
  socket = io(url);
  socket.on('connect', () => {
    app.globalData.wsConnect = true;

   
  //  socket.close()

    socket.on('disconnect', msg => {
      app.globalData.wsConnect = false;
    });
    
    socket.on('disconnecting', () => {
    });

    socket.on('error', () => {
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


  //断网重连
function networkChange(){
  // console.log('hhhhhhhhhhhhhhhhhhhh')
  // wx.onNetworkStatusChange(function (res) {
  //   console.log('断网====================================')
  //   if (res.isConnected && changePage) {
  //     wx.showToast({
  //       title: "房间已不存在",
  //       icon: "none",
  //       duration: 1000
  //     })
  //     setTimeout(() => {
  //       wx.reLaunch({
  //         url: '../index/index',
  //       })
  //     }, 1000)
  //   }
  // })
}

//检测手机黑屏
function checkoutIsRoom(rid, changePage = true) {
  doFetch('english.checkroom', { rid }, res => {
    if (!changePage && res.data && res.data.inRoom) {  //退出房间，不切换页面
      wsSend('leaveroom', { rid })
    }
    if (res.data && !res.data.inRoom && changePage) {
      wx.showToast({
        title: "房间已不存在",
        icon: "none",
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
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
  wsReceive,
  wsClose,
  shareSuc,
  firstStart,
  checkoutIsRoom,
  networkChange,
  wsConnect,
  wsClosed
}