//app.js
const config = require('config.js');

App({
  onLaunch: function(option) {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo(function() {
      that.doLogin();
    });
    
    console.log(" onLaunch path: " + option.path + ", option.scene: " + option.scene);
  },

  getUserInfo: function(cb) {
    var that = this;
    console.log("测试:"+this.globalData.userInfo);
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log("测试调用");
      //调用登录接口
      wx.login({
        success: function (r) {
          console.log("login:" + JSON.stringify(r));
          wx.getUserInfo({
            withCredentials: false,
            success: function(res) {
              console.log("用户信息成功 json: " + JSON.stringify(res.userInfo));
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            complete:function(){
              console.log("用户信息完成");
            },
            fail:function(res){//弹出警告
              wx.openSetting({
                success: function (res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      that.globalData.userInfo = res.userInfo
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  }
                })
              console.log("用户信息失败"+JSON.stringify(res));
            }
          })
        }
      })
    }
  },

  showToast: function (text, o, count) {
    var _this = o;
    count = parseInt(count) ? parseInt(count) : 2000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },

  doLogin: function (callback) {
    var self = this;
    wx.login({
      success: function (res) {
        console.log("login success code: " + res.code
          + ", result msg: " + res.errMsg);
        wx.setStorageSync('logincode',res.code);
        self.queryUserId(res.code, callback);
      },
      complete: function () {
        console.log("login complete");
      }
    })
  },

  queryUserId: function (code,callback) {
    console.log("queryUserId code:" + code);
    var that = this;
    var url = this.globalData.config.domain + "/onlogin?code=" + code;
    console.log("queryUserId: " + url + ", userinfo: " + JSON.stringify(that.globalData.userInfo));
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      data: that.globalData.userInfo,
      method:'POST',
      success: function (res) {
        console.log("queryUserId success code: " + JSON.stringify(res.data));
        var response = res.data;
        if (that.isSuccess(res.data.statusCode)) {
          wx.setStorageSync('token', response.data.token);
          if (typeof (callback) == 'function') {
            console.log("doLogin success now do callback: " + callback);
            callback();
          }
        }
      },
      fail: function (res) {
        console.log("queryUserId fail msg: " + JSON.stringify(res));
      },
      complete: function () {
        console.log("queryUserId complete ");
      }
    })
  },
  
  globalData: {
    userInfo: {},
    config: config,
    addressId: "",
    token: wx.getStorageSync("token"),
    servicePhone: "17750224350",
    defUserInfo: {
      "nickName": "",
      "gender": 1,
      "language": "",
      "city": "",
      "province": "",
      "country": "",
      "avatarUrl": ""
    }
  },
   
   getToken: function() {
     return wx.getStorageSync("token");
   },

   isShouldLogin :function(statusCode) {
     return statusCode == 101 || statusCode == 102;
   },

   isSuccess: function (statusCode) {
      return statusCode == 200;
   },

   updateOrderStatus: function (orderId) {
     var that = this;
     var updateUrl = this.globalData.config.domain + "/api/order/1/orderstatus/" + orderId + "/2";
     wx.request({
       url: updateUrl,
       header: {
         'content-type': 'application/json',
         'access_token': that.getToken()
       },
       method: 'POST',
       success: function (res) {
         console.log(res.data.statusCode + ", msg: " + res.data.msg);
         if (that.isShouldLogin(res.data.statusCode)) {
           that.doLogin(function () {
             that.updateOrderStatus(orderId);
           });
           console.log("updateOrderStatus token invalid ...");
         } else if (that.isSuccess(res.data.statusCode)) {

           console.log("updateOrderStatus success orderId: " + orderId);
         }
       }

     });
   },

   doWxPay: function (orderInfo, successCallback, failCallback, completeCallback) {
     var that = this;
     var payUrl = this.globalData.config.domain + "/api/pay"
     wx.request({
       url: payUrl,
       header: {
         'content-type': 'application/json',
         'access_token': that.getToken()
       },
       data: {
         totalAmount: orderInfo.totalAmount,
         orderSn: orderInfo.orderSn,
       },
       method: 'POST',
       success: function (res) {
         console.log(res.data.statusCode + ", msg: " + res.data.msg);
         if (that.isShouldLogin(res.data.statusCode)) {
           that.doLogin(function () {
             that.doWxPay(orderInfo, orderInfo.orderId);
           });
           console.log("pref pay token invalid ...");
         } else if (that.isSuccess(res.data.statusCode)) {
           console.log("pref pay success ...");
           that.pay(res.data.data, 
            orderInfo.orderId, 
            successCallback, 
            failCallback, 
            completeCallback);
         } else {
           console.log("pref pay error ...");
         }
       }
     });
   },
   pay: function (payInfo, orderId, successCallback, failCallback, completeCallback) {
     console.log("doWxPay payInfo: " + JSON.stringify(payInfo));
     var that = this;
     //小程序发起微信支付
     wx.requestPayment({
       //记住，这边的timeStamp一定要是字符串类型的，
       //不然会报错，我这边在java后端包装成了字符串类型了
       timeStamp: payInfo.timeStamp,
       nonceStr: payInfo.nonceStr,
       package: payInfo.packageStr,
       signType: 'MD5',
       paySign: payInfo.paySign,
       success: function (event) {
         // success   
         console.log("pay success, orderId: " + orderId);
         that.updateOrderStatus(orderId);
         if (typeof (successCallback) == 'function') {
           console.log("pay success now do callback: " + successCallback);
           successCallback();
         }
       },
       fail: function (error) {
         // fail 
         console.log("支付失败")
         console.log(error)
         if (typeof (failCallback) == 'function') {
           console.log("pay fail now do callback: " + failCallback);
           failCallback();
         }
       },
       complete: function () {
         // complete   
         console.log("pay complete")
         if (typeof (completeCallback) == 'function') {
           console.log("pay complete now do callback: " + completeCallback);
           completeCallback();
         }
       }
     });
   },
   

})
