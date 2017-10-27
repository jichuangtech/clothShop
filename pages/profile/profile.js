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
    // this.doLogin();
  },

  // doLogin: function () {
  //   var self = this;
  //   wx.login({
  //     success: function(res) {
  //       console.log("login success code: " + res.code
  //         + ", result msg: " + res.errMsg);
  //       self.queryUserId(res.code);
  //     },
  //     complete: function(){
  //       console.log("login complete");
  //     }
  //   })  
  // },

  // queryUserId: function(code) {
  //   var url = "http://172.20.10.3:8070/onlogin?code=" + code;
  //   console.log("queryUserId: " + url);

  //   wx.request({
  //     url: url,
  //     success: function (res) {
  //       console.log("queryUserId success code: " + JSON.stringify(res.data));
  //       wx.setStorageSync('token', res.data.data.token);
  //     },
  //     fail: function(res) {
  //       console.log("queryUserId fail msg: " + JSON.stringify(res));
  //     },
  //     complete: function() {
  //       console.log("queryUserId complete ");
  //     }
  //   })
  // },

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
