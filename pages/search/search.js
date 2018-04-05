// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    getSearch: [],
    modalHidden: true
  },

  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  setSearchStorage: function () {
    if (this.data.inputValue != '') {
      var searchData = wx.getStorageSync('searchData') || []
      var length = searchData.length
      searchData[length] = this.data.inputValue
      wx.setStorageSync('searchData', searchData)
      wx.navigateTo({
        url: '../result/result'
      })
    } else {
      console.log('输入不能为空')
    }
  },

  modalChangeConfirm: function () {
    wx.setStorageSync('searchData', [])
    this.setData({
      modalHidden: true,
      getSearch: []
    })
    wx.redirectTo({
      url: '../search/search'
    })
  },
  modalChangeCancel: function () {
    this.setData({
      modalHidden: true
    })
  },
  clearSearchStorage: function () {
    this.setData({
      modalHidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var getSearch = wx.getStorageSync('searchData');
    this.setData({
      getSearch: getSearch,
      inputValue: ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  clearInput: function () {
    this.setData({
      inputValue: ''
    })
  }
})