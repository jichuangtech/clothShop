// confirmOrder.js
var app = getApp();
Page({

  data: {
    domain: app.globalData.config.domain,
    defalutAddreee:"",
    addressId:"",
    proInfo:"",
    allMoney:0,
    defaulMark:false
  },

  onLoad: function () {
    console.log("确认订单onLoad");
    var allMoney = 0;
    var proInfo = wx.getStorageSync('proInfo');
    console.log("参数:" + JSON.stringify(proInfo[0]));
    for(var i=0;i<proInfo.length;i++){
      allMoney = (parseFloat(allMoney) + parseFloat(proInfo[i].goodsNum * proInfo[i].shopPrice)).toFixed(2);
    }
    this.setData({
      proInfo: proInfo,
      allMoney: allMoney
    });
  },

  onReady: function () {
    console.log("确认订单onReady");
  },
  onShow: function () {
    console.log("确认订单onShow" + app.globalData.addressId);
    if (app.globalData.addressId) {
      this.setData({
        addressId: app.globalData.addressId
      });
      this.getAddressDetail();
    } else {
      this.getDefaultAddress();
    }
  },

  //请求默认地址
  getDefaultAddress(){
    var that = this,
        addressInfo = "";
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/defaultaddress',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode==200){
          that.setData({
            defalutAddreee:res.data.data,
            addressId: res.data.data.addressId,
            defaulMark:true
          });
        }
        console.log("成功");
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //请求地址
  getAddressDetail:function(){
    var that = this,
        addressInfo = "";
    wx.request({
      url: that.data.domain + '/api/useraddress/address/' + that.data.addressId + '',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode == 200) {
          addressInfo = res.data.data;
          addressInfo['address'] = res.data.data['provinceName'] + res.data.data['cityName'] + res.data.data['districtName']+res.data.data['address'];
          that.setData({
            defalutAddreee: addressInfo,
            defaulMark: true
          })
          console.log('成功');
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  getOrderInfos: function() {
    var orderInfos = [];
    //注意这块的代码书写
    for (var index in this.data.proInfo) {
      var orderInfo = this.data.proInfo[index];
      var item = {
        colorId: orderInfo.colorId,
        goodsId: orderInfo.productId,
        goodsNum: orderInfo.goodsNum,
        specId: orderInfo.specId
      };
      
      orderInfos.push(item);
    }
    return orderInfos;
  },
  //提交订单
  submitOrder: function () {
    
    var that = this;
    if (!that.data.defaulMark) {
      app.showToast("您还没添加收获地址", that);
      return false;
    }
    wx.request({
      url: that.data.domain + '/api/order/16777215',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      data:{
        addressId: that.data.addressId,
        goodsReqVOList: that.getOrderInfos(),
        userId: 16777215
      },
      method: 'POST',
      success: function (res) {
        console.info("订单创建成功 msg: " + JSON.stringify(res.data));
        let statusCode = res.data.statusCode;
        if (app.isShouldLogin(statusCode)) {
          app.doLogin(function() {
            that.submitOrder();
          });
        } else if (app.isSuccess(statusCode)) {
          console.log("订单创建成功，然后利用订单号进行支付 msg: " 
          + JSON.stringify(res.data.data));           
          that.doWxPay(res.data.data);
        } else {
          app.shoToast("订单创建失败");
          console.log("订单创建失败 msg: " + res.data.msg);           
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  doWxPay: function (orderInfo) {
    var that = this;
    var payUrl = this.data.domain + "/api/pay"
    wx.request({
      url: payUrl,
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      data: {
        totalAmount: orderInfo.totalAmount,
        orderSn: orderInfo.orderSn,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.statusCode + ", msg: " + res.data.msg);
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function() {
            that.doWxPay(orderInfo);
          });
          console.log("pref pay token invalid ...");
        } else if (app.isSuccess(res.data.statusCode)) {
          that.pay(res.data.data);
          console.log("pref pay success ...");
        } else {
          console.log("pref pay error ...");
        }
      }
    });
  },
  pay: function (payInfo) {
    console.log("doWxPay payInfo: " + JSON.stringify(payInfo));
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
        console.log(event);
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (error) {
        // fail   
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    });
  }



})