// components/movieclip/movieclip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    resWidth:{
      type: Number,
      value: 750,
    },
    resHeight: {
      type: Number,
      value: 100
    },

    resRoot:{
      type: String,
      value: 'https://gengxin.odao.com/update/h5/yingyu/xuliezhen/'
    },
    resPrefix: {
      type: String,
      value:''
    },
    resStartIdx: {
      type: Number,
      value: 1
    },
    resEndIdx: {
      type: Number,
      value: 2
    },
    resPreZeroCount: {
      type: Number,//资源idx前置几个0。如：xxx_png_001.png这种出图命名方式下，可以看出"001.png"是前置两个0，此值需要设置为2
      value: 1
    },
    autoPlay: {
      type:Boolean,//是否在挂载后自动播放
      value:true
    },
    autoPlayCount: {
      type: Number,//自动播放次数，默认为无限循环
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    needLoopTime:1,
    leftLoop:0,
    tm:null,
    curIdx:0,
    res: '',
  },

  attached: function(){
    this.triggerEvent('mcAttached');

    if (this.data.autoPlay) {
      this.play(this.data.autoPlayCount);
    }
  },
  moved: function(){
    this.stop();
  },
  detached: function(){
    this.triggerEvent('mcDetached');
    this.stop();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //对数字前置补0，如
    _prefillZero(num, cnt = 1) {
      let prefix = '';
      while(cnt-- > 0) {
        prefix += '0';
      }
      return (num + '').replace(/^0?/, prefix);

    },
    /**
    * @param loopTime 循环次数，如果传的值 <= 0,则无限循环
    */
    play(loopTime = 1) {
      this.setData({
        needLoopTime: loopTime,
        leftLoop: loopTime,
        curIdx: this.data.resStartIdx,
        res: this.data.resPrefix + this._prefillZero(this.data.resStartIdx, this.data.resPreZeroCount)
      });

      let tm = this.data.tm;
      if (tm) {
        clearInterval(tm);
      }
      tm = setInterval(()=> {
        let curIdx = this.data.curIdx;
        curIdx++;


        if (curIdx > this.data.resEndIdx) {
          //已完成一次动画循环
          let needLoopTime = this.data.needLoopTime;
          let leftLoop = this.data.leftLoop;

          //reset 
          curIdx = this.data.resStartIdx;

          if (needLoopTime > 0) {
            leftLoop--;
            if (leftLoop <= 0) {
              //finish all loops
              this.stop();
            }
          }
        }

        let res = this.data.resPrefix + this._prefillZero(curIdx, this.data.resPreZeroCount);
        this.setData({res, curIdx, tm});

      }, 80);//约12帧/秒

      this.setData({tm});
    },

    stop() {
      let tm = this.data.tm;
      if (tm) {
        clearInterval(tm);
        this.setData({tm:null})
      }
    }
  }
})
