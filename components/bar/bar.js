// components/scoreBar/bar.js
const totalScore = 300;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score: {
      type: String,
      value: '0',
      observer:function(score){
        var percent = score/totalScore*100 + '%';
        this.setData({
          percent
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    'percent':'0'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
