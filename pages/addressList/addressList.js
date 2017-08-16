// addressList.js
var app = getApp()

Page({

  data: {
    domain: app.config.domain,
    addressList:[]
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
    this.getAddressList();
  },

  onShow: function () {
  
  },

  onUnload: function () {
  
  },
  
  //地址请求
  getAddressList:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          addressList:res.data.data
        })
        console.log(JSON.stringify(res.data.data));
      },
      fail: function () {
        console.log("失败");
      }
    });
  }
})