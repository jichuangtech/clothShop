//app.js
const config = require('config.js');

App({
  onLaunch: function(option) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.doLogin();
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
              console.log("用户信息成功");
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

  doLogin: function () {
    var self = this;
    wx.login({
      success: function (res) {
        console.log("login success code: " + res.code
          + ", result msg: " + res.errMsg);
        wx.setStorageSync('logincode',res.code);
        self.queryUserId(res.code);
      },
      complete: function () {
        console.log("login complete");
      }
    })
  },

  queryUserId: function (code,callback) {
    var url = "https://www.jichuangtech.site/clothshopserver/onlogin?code="+code;
    console.log("queryUserId: " + url);

    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("queryUserId success code: " + JSON.stringify(res.data));
        wx.setStorageSync('token', res.data.data.token);
        wx.setStorageSync('test',12);
        if(callback === "function"){
          callback();
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
    userInfo: null,
    config: config,
    addressId: "",
    token: wx.getStorageSync("token")
  },
})
