// pages/orderDetail/orderDetail.js
var app = getApp();

Page({

  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    orderId:"",
    orderInfo:"",
    orderStatus:['','等待买家付款','等待卖家发货','卖家已发货','交易成功']
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

  //订单信息
  getOrderInfo:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/order/detail/' + that.data.orderId+'',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        var statusCode = res.data.statusCode;

        if(app.isShouldLogin(statusCode)) {
          app.doLogin(function() {
            that.getOrderInfo();
          });
        } else if(app.isSuccess(statusCode)) {
          that.setData({
            orderInfo: res.data.data,
            test: "刚刚"
          })
        } else {
          app.showToast("嗷嗷，获取订单详情失败~~", that);
          console.error("get order detail error msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  pay: function () {
    app.doWxPay(this.data.orderInfo,
      function () {
        wx.navigateBack();

      },
      function () {
        wx.redirectTo({
          url: "../orderDetail/orderDetail?orderid=" + orderInfo.orderId
        })
        console.error("order Detail pay error");
      });
  }


})