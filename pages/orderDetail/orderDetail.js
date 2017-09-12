// pages/orderDetail/orderDetail.js
var app = getApp();

Page({

  data: {
    domain: app.config.domain,
    orderId:"",
    addressInfo:""
  },

  onLoad: function (options) {
    console.log("订单id：" + options.orderid);
    this.setData({
      orderId: options.orderid
    });
  },

  onReady: function () {
    this.getOrderInfo();
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  //请求收获地址
  getAddress: function () {
    var that = this,
        addressInfo = "";
    wx.request({
      url: that.data.domain + '/api/useraddress/address/' + that.data.addressId + '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode == 200) {
          addressInfo = res.data.data;
          addressInfo['address'] = res.data.data['provinceName'] + res.data.data['cityName'] + res.data.data['districtName'] + res.data.data['address'];
          that.setData({
            addressInfo: addressInfo
          })
          console.log('成功');
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //订单信息
  getOrderInfo:function(){

  }

})