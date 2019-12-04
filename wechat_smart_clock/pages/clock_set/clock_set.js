// pages/clock_set/clock_set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    room_name : "",
    input_name: "",
    showModal: false,
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





  //显示遮罩

  //设置房间
  set_room: function () {
    this.setData({
      showModal: true
    })
  },
  inputChange: function (e) {
    this.setData({
      input_name: e.detail.value
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this
    that.hideModal();
    that.setData({
      room_name: that.data.input_name
    })
    var name = 'room_name_' + that.data.id
    console.log("setStorage room_name", name)
    try {
      wx.setStorageSync(name, that.data.input_name)
    } catch (e) {
      // Do something when catch error
      console.log("setStorageSync error!")
    }
    console.log("success")
  }

})