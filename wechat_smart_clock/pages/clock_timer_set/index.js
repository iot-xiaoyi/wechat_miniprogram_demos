// pages/clock_set/clock_set.js
var onenet = require('../../js/onenet.js');

const hours = []
const minutes = []

for (let i = 0; i <= 23; i++) {
  hours.push(i)
}

for (let i = 0; i <= 59; i++) {
  minutes.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    index:0,
    room_name: "",
    input_name: "",
    showModal: false,
    deleteDeviceFlag: 0,
    hourFlag: 1,
    sunFlag: 1,
    tempFlag: 1,
    weatherFlag: 0,
    hours:hours,
    hour:2,
    minutes:minutes,
    minute:2,
    value: [ 10, 0],
    week_items: [
      { name: 'monday', value: '星期一' },
      { name: 'tuesday', value: '星期二' },
      { name: 'wednesday', value: '星期三' },
      { name: 'thursday', value: '星期四' },
      { name: 'friday', value: '星期五' },
      { name: 'saturday', value: '星期六' },
      { name: 'sunday', value: '星期日' },
    ],
    week_select:[],
    repeat:"永不"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //get storage data
    var name = 'room_name_' + options.id
    console.log(name)
    that.setData({
      id: options.id,
      index:options.index
    })
    try {
      var value = wx.getStorageSync(name)
      if (value) {
        // Do something with return value
        that.setData({
          room_name: value
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log("get stroage data error!")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  save_fun: function(e){
    var that = this
    console.log("click save.")
    var timer_data = "time is " + that.data.hour + "时" + that.data.minute + "分"
    console.log(timer_data)
    console.log("select week is ", that.data.week_select)
    //send to cloud
    var repeat = 0
    if ( "永不" == that.data.repeat)
    {
      repeat = 0
    }else
    {
      repeat = 1
    }
    var week = ""
    for (var i=0; i<that.data.week_select.length; i++)
    {
      console.log(that.data.week_select[i])
      if ("monday" == that.data.week_select[i])
      {
        week = week + "1 "
      } else if ("tuesday" == that.data.week_select[i])
      {
        week = week + "2 "
      } else if ("wednesday" == that.data.week_select[i])
      {
        week = week + "3 "
      } else if ("thursday" == that.data.week_select[i])
      {
        week = week + "4 "
      } else if ("friday" == that.data.week_select[i]) {
        week = week + "5 "
      } else if ("saturday" == that.data.week_select[i]) {
        week = week + "6 "
      } else if ("sunday" == that.data.week_select[i]) {
        week = week + "7 "
      }
    }
    var timer_new_data = "{\"name\":\"timer_set\",\"value\":{\"id\":" + that.data.index + ",\"enable\":1,\"time\":\"" + that.data.hour + ":" + that.data.minute + "\",\"repeat\":" + repeat + ",\"week\":" + "\"" + week + "\"}}"
    onenet.sendCmd(that.data.id, timer_new_data)
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1000
    })
  },

  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]]
    })
  },

  checkboxChange: function (e) {
    var that = this
    
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    that.setData({
      week_select:e.detail.value,
      repeat:"开启"
    })
  }

})