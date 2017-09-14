// pages/orderDetail/orderDetail.js
var app = getApp();

Page({

  data: {
    domain: app.config.domain,
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
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode == 200) {
          that.setData({
            orderInfo: res.data.data,
            test:"刚刚"
          })
           console.log('成功' + JSON.stringify(that.data.orderInfo));
          console.log('成功' + (that.data.orderInfo.address));
          console.log('成功地址' + (res.data.data.address));
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  }

})