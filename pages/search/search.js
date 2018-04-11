// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: app.globalData.config.domain,
    para1: '',
    para2: 'none',
    loadTip: '',
    inputValue: '',
    getSearch: [],
    modalHidden: true,
    searchList: [],
    search: [],
    s: []
  },

  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    wx.setStorageSync('inputValue', e.detail.value);
  },

  bindfocus: function () {
    this.setData({
      para1: '',
      para2: 'none'
    })
  },

  setSearchStorage: function () {
    var that = this;
    if (that.data.inputValue != '') {
      var searchData = wx.getStorageSync('searchData') || []
      var length = searchData.length
      searchData[length] = this.data.inputValue
      wx.setStorageSync('searchData', searchData)
      this.getSearchList();
    } else {
      console.log('输入不能为空')
    }
  },

  setInputValue: function (e) {
    var that=this;
    that.setData({
      inputValue: e.currentTarget.dataset.name
    })
  },

  getSearchList: function () {
    var that = this;
    wx.request({
      url: that.data.domain + '/api/info/goods',
      header: {
        'content-type': 'application/json',
      },
      method: 'GET',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function () {
            that.getSearchList();
          });
        } else if (app.isSuccess(res.data.statusCode)) {
          that.setData({
            searchList: res.data.data
          });
          wx.setStorageSync('searchList', res.data.data);
          that.setData({
            para1: 'none',
            para2: ''
          });       
        }else {
          that.setData({
            loadTip: "暂时没有数据"
          });
        }
      }
    })
    that.selectResult();
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
  
  selectResult: function () {
    var that=this;
    var s = wx.getStorageSync('searchList');
    var i = wx.getStorageSync('inputValue');
    console.log(s[4].goodsContent+'00000');
    var search = [];
    for (var x in s) {
      if ((s[x].goodsContent).indexOf(i) >= 0) {
        search.push(s[x]);
      }
    }
    that.setData({
      search: search
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