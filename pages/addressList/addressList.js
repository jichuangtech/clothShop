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
  },
  //删除地址
  delAddress:function(e){
    var that = this,
        id = e.currentTarget.dataset.id;
    if(!id){
      return false;
    }
    wx.request({
      url: that.data.domain + '/api/useraddress/address/' + id+'',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.statusCode==200){
          app.showToast('删除成功', that);
          that.getAddressList();
        }
        console.log('成功');
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //设置默认地址
  setDefalut:function(e){
    var that = this,
      id = e.currentTarget.dataset.id,
      isDefault = e.currentTarget.dataset.isdefault;
    console.log("isDefault:" + isDefault);
    if (!id || isDefault==0) {
      return false;
    }
  
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/defaultaddress/'+id+'',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.statusCode == 200) {
          app.showToast('设置成功', that);
          that.getAddressList();
        }
        console.log('成功');
      },
      fail: function () {
        console.log("失败");
      }
    });
  }
})