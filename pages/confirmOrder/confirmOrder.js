// confirmOrder.js
var app = getApp();
Page({

  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    defalutAddreee:"",
    addressId:"",
    proInfo:"",
    allMoney:0,
    defaulMark:false
  },

  onLoad: function (option) {
    console.log("确认订单onLoad option: " + JSON.stringify(option));
    var from = option.from;
    var isFromGoodsCart = false;
    if (from != undefined && from == "goodsCart") {
      isFromGoodsCart = true;
    }
    console.log("确认订单onLoad option from: " + from + ", isFromGoodsCart: " + isFromGoodsCart);

    var allMoney = 0;
    var goodsCartIds = [];
    var proInfo = wx.getStorageSync('proInfo');
    console.log("确认订单参数:" + JSON.stringify(proInfo[0]));
    for(var i=0;i<proInfo.length;i++){
      allMoney = (parseFloat(allMoney) + parseFloat(proInfo[i].goodsNum * proInfo[i].shopPrice)).toFixed(2);
      goodsCartIds[i] = proInfo[i].goodsCartId;
    }
    console.log("确认订单参数 ids: " + goodsCartIds);
    this.setData({
      proInfo: proInfo,
      allMoney: allMoney,
      isFromGoodsCart: isFromGoodsCart,
      goodsCartIds: goodsCartIds
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
        goodsId: orderInfo.goodsId,
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
          that.pay(res.data.data);
        } else {
          app.showToast("订单创建失败", that);
          console.log("订单创建失败 msg: " + res.data.msg);           
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //删除购物车
  delCarts: function () {
    var that = this;
    console.log("delCarts:" + this.data.goodsCartIds);
    wx.request({
      url: that.data.domain + '/api/goodsCart/',
      data: {
        cartIds: that.data.goodsCartIds
      },
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'DELETE',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          that.doLogin(function() {
            that.delCarts();
          });
        } else if (app.isSuccess(res.data.statusCode)){
          console.log("确认订单 from goodcart del success");
        }
      },
      fail: function () {
        console.log("确认订单 from goodcart del error");
      }
    });
  },

  pay: function (orderInfo) {
    var that = this;
    app.doWxPay(orderInfo, 
    function() {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(function() {
        wx.navigateBack();
      }, 2000);

    },
    function() {
      wx.redirectTo({
        url: "../orderDetail/orderDetail?orderid=" + orderInfo.orderId
      })
    },
    function() {
      if (that.data.isFromGoodsCart) {
        that.delCarts(that.data.goodsCartIds);
      }
    });
  }
  
})