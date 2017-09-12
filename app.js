//app.js
const config = require('config.js');

App({
  onLaunch: function(option) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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

  //toast
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
  
  globalData: {
    userInfo: null
  },
  config: config
})
