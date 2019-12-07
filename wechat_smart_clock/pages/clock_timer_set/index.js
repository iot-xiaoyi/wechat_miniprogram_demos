// pages/clock_set/clock_set.js
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
      { name: 'sundy', value: '星期日' },
    ]
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
      id: options.id
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

  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]]
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }

})