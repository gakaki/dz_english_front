
Page({
  data: {
    tabAct: true
  },
  clickTab() {
    this.setData({
      tabAct: !this.data.tabAct
    })
  }
})