
function ws(data, success){
  var socketOpen = false
  var socketMsgQueue = []
  wx.connectSocket({
    url: 'test.php'
  })

  wx.onSocketOpen(function (res) {
    socketOpen = true
    for (var i = 0; i < socketMsgQueue.length; i++) {
      sendSocketMessage(socketMsgQueue[i])
    }
    socketMsgQueue = []
  })

  function sendSocketMessage(msg) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }
  }
}

module.exports = {
  ws
}