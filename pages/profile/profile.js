//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    console.log("用户信息" + that.data.userInfo);
    console.log("用户信息" + JSON.stringify(that.data.userInfo));
    console.log(that.data.userInfo[0]);
  },
  
  phoneCall: function (e) {
    console.log(78);
    wx.makePhoneCall({
      phoneNumber: "18850549612"
    })
  },

  //点击订单状态
  checkOrderStatus:function(e){
    var that = this,
      orderStatus = e.currentTarget.dataset.type;
    console.log(orderStatus);
    wx.navigateTo({
      url: "../myOrder/myOrder?orderStatus=" + orderStatus
    })
  }
})
