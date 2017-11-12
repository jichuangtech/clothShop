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
   }

})
