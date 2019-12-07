var WxAutoImage = require('../../js/wxAutoImageCal.js');
var onenet = require('../../js/onenet.js');
var API_KEY = "eCQJZEKoyVqA5qV4ef3qTH2OZzo="
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
    that.data.myintervalid = setInterval(function () {
      that.onShow()
    }, 3000)

// ################################## 闹钟 #################################
    for (var i = 0; i < 2; i++) {
      this.data.items.push({
        content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
        isTouchMove: false //默认全隐藏删除
      })
    }
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
  btn_red_led_fun: function (e) {
    var that = this;
    if (false == e.detail.value)
    {
      console.log("ready to open red led!");
      onenet.sendCmd(that.data.id, "0")
      that.setData({
        redSwitchChecked: false,
        greenSwitchChecked: false,
        blueSwitchChecked: false
      })
    }else
    {
      console.log("ready to close red led!");
      onenet.sendCmd(that.data.id, "2")
      that.setData({
        redSwitchChecked: true,
        greenSwitchChecked: false,
        blueSwitchChecked: false,
        switchFlag:true
      })
    }
  },
  btn_green_led_fun: function (e) {
    var that = this;
    if (false == e.detail.value) {
      console.log("ready to open blue led!");
      onenet.sendCmd(that.data.id, "0")
      that.setData({
        redSwitchChecked: false,
        greenSwitchChecked: false,
        blueSwitchChecked: false
      })
    } else {
      console.log("ready to close blue led!");
      onenet.sendCmd(that.data.id, "3")
      that.setData({
        redSwitchChecked: false,
        greenSwitchChecked: true,
        blueSwitchChecked: false,
        switchFlag: true
      })
    }
  },
  btn_blue_led_fun: function (e) {
    var that = this;
    if (false == e.detail.value) {
      console.log("ready to open blue led!");
      onenet.sendCmd(that.data.id, "0")
      that.setData({
        redSwitchChecked: false,
        greenSwitchChecked: false,
        blueSwitchChecked: false
      })
    } else {
      console.log("ready to close blue led!");
      onenet.sendCmd(that.data.id, "4")
      that.setData({
        redSwitchChecked: false,
        greenSwitchChecked: false,
        blueSwitchChecked: true,
        switchFlag: true
      })
    }
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
      url: "http://api.heclouds.com/devices/" + id + "/datapoints?datastream_id=color",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "api-key": API_KEY
      },
      data: {

      },
      success(res) {
        console.log(res)
        deviceConnected = true

        if (that.data.switchFlag != true)
        {
          color_value = res.data.data.datastreams[0].datapoints[0].value
          switch (parseInt(color_value)) {
            case 1:
              that.setData({
                redSwitchChecked: false,
                greenSwitchChecked: false,
                blueSwitchChecked: false
              })
              break;
            case 2:
              that.setData({
                redSwitchChecked: true,
                greenSwitchChecked: false,
                blueSwitchChecked: false
              })
              break;
            case 3:
              that.setData({
                redSwitchChecked: false,
                greenSwitchChecked: true,
                blueSwitchChecked: false
              })
              break;
            case 4:
              that.setData({
                redSwitchChecked: false,
                greenSwitchChecked: false,
                blueSwitchChecked: true
              })
              console.log("color_value is ", color_value)
              console.log("blueSwitchChecked is ", that.data.blueSwitchChecked)
              break;
          }
          console.log("color_value is ", color_value)
        }else{
          that.setData({
            switchFlag:false
          })
        }
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