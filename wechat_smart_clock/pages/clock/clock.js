var WxAutoImage = require('../../js/wxAutoImageCal.js');
var onenet = require('../../js/onenet.js');

var app = getApp();

Page({
  data: {
    imgUrls: [
      '../../image/swiper1.jpg',
      '../../image/swiper1.jpg',
      '../../image/swiper1.jpg'
    ],
    id:0,
    redSwitchChecked:false,
    greenSwitchChecked:false,
    blueSwitchChecked:false,
    switchFlag:false,
    myintervalid:0,
    /*  clock */
    items: [],
    data_ctx: {temp: 25, temp_mode: 1 },
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function (e) {
    var that = this;
    console.log("onloading......");
    console.log("id is ", e.id)
    that.setData({
      id:e.id
    })
    that.getDataPoints(e.id)
    // that.data.myintervalid = setInterval(function () {
    //   that.onShow()
    // }, 3000)

// ################################## 闹钟 #################################
    this.data.items.push({
      time: that.data.data_ctx.timer_set[0].time,
      week: that.data.data_ctx.timer_set[0].week,
      enable:that.data.data_ctx.timer_set[0].enable,
      isTouchMove: false //默认全隐藏删除
    })

    this.setData({
      items: this.data.items
    })
  },

  onShow: function (e) {
    var that = this
    // var dat = onenet.getDeviceStatus(e.id);
    // if (dat)
    //   console.log("connect to cloud success!");
    // else
    //   console.log("connect to cloud error!");

    that.getDataPoints(that.data.id)
  },

  onHide: function () {
    // 页面隐藏
    clearInterval(this.data.myintervalid);
  },

  onUnload: function () {
    // 页面关闭
    clearInterval(this.data.myintervalid);
  },

  device_manage: function(e) {
    var that = this
    wx.navigateTo({
      url: '../clock_set/clock_set?id=' + that.data.id,
    });
  },

  go_into_clock_timer_set: function (e) {
    var that = this
    wx.navigateTo({
      url: '../clock_timer_set/index?id=' + that.data.id,
    });
  },

  // LED控制
  switchChange: function (e) {
    console.log(e.detail.value)
  },

  //onenet interfce
  getDataPoints: function (id) {
    var that = this
    var deviceConnected
    var color_value = 0
    //查看设备连接状态，并刷新按钮状态
    wx.request({
      url: "http://api.heclouds.com/devices/" + id + "/datastreams?datastream_ids=temp,temp_mode,humi,timer_set,time_mode,time_show_mode,voice",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "api-key": app.globalData.api_key
      },
      data: {

      },
      success(res) {
        console.log(res)
        deviceConnected = true

        that.data.data_ctx.temp = res.data.data[0].current_value
        that.data.data_ctx.temp_mode = res.data.data[1].current_value
        that.data.data_ctx.humi = res.data.data[2].current_value
        that.data.data_ctx.timer_set = res.data.data[3].current_value
        that.data.data_ctx.time_mode = res.data.data[4].current_value
        that.data.data_ctx.time_show_mode = res.data.data[5].current_value
        that.data.data_ctx.voice = res.data.data[6].current_value

        that.setData({
          data_ctx:that.data.data_ctx
        })
        console.log(that.data.data_ctx.temp, that.data.data_ctx.humi, that.data.data_ctx.temp_mode, that.data.data_ctx.time_mode, that.data.data_ctx.time_show_mode, "voice is", that.data.data_ctx.voice )
        console.log("timer_set is", that.data.data_ctx.timer_set)

      },
      fail(res) {
        console.log("请求失败")
        deviceConnected = false
      }
    })
  },

// ############################### 闹钟 ##############################
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
  },
  //跳转
  goDetail() {
    console.log('点击元素跳转')
  }

})