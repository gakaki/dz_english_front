// components/scoreBar/bar.js
const totalScore = 1200;
let oldScoreA = 0;
let oldScoreB = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scoreA: {
      type: Number,
      value: 0,
      observer:function(score){
        oldScoreA = score + oldScoreA;
        var percent = oldScoreA/totalScore*100 + '%';
        this.setData({
          percent,
          nowScoreA: oldScoreA
        })
      }
    },
    scoreB: {
      type: Number,
      value: 0,
      observer: function (score) {
        oldScoreB = score + oldScoreB;
        var percent = oldScoreB / totalScore * 100 + '%';
        this.setData({
          percent,
          nowScoreB: oldScoreB
        })
      }
    },
    type: {
      type: String,
      value:"A"
    }
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    'percent':'0',
    'nowScoreA': 0,
    'nowScoreB': 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
