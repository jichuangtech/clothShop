// confirmOrder.js
var app = getApp();
Page({

  data: {
    domain: app.config.domain,
    defalutAddreee:"",
    proId: "",
    proNum:"",
    proDetail:"",
    colorId:"",
    priceType:"",
    colorInfo:"",
    priceInfo: "",
    allMoney:0
  },

  onLoad: function (options) {
    console.log("商品Id:"+options.proId);
    console.log("商品数量:" + options.proNum);
    console.log("商品颜色:" + options.colorId);
    console.log("商品价格:" + options.priceType);
    this.setData({
      proId: options.proId,
      proNum: options.proNum,
      colorId: options.colorId,
      priceType: options.priceType
    });
  },

  onReady: function () {
    this.getDefaultAddress();
  },

  onShow: function () {
    this.getProDetail();
  },

  //请求默认地址
  getDefaultAddress(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/defaultaddress',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log("成功");
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //获取商品详情
  getProDetail:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goods/' + that.data.proId + '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var priceInfo = res.data.goodsSpecs;
        var colorInfo = res.data.goodsColors;
        console.log("res.data.goodsSpecs:" + JSON.stringify(res.data.goodsSpecs));
        console.log("res.data.goodsSpecs:" + that.data.priceType);
        
        for (var i = 0; i < priceInfo.length;i++){
          if (priceInfo[i]["specId"] == that.data.priceType){
            priceInfo = priceInfo[i];
          }
        }
        for (var i = 0; i < colorInfo.length; i++) {
          if (colorInfo[i]["colorId"] == that.data.colorId) {
            colorInfo = colorInfo[i];
          }
        }
        that.setData({
          colorInfo: colorInfo,
          priceInfo: priceInfo,
          proDetail: res.data,
          allMoney: parseFloat(parseInt(that.data.proNum) * parseFloat(priceInfo['specPrice']))
        });
      },
      fail: function () {
        console.log("注册失败");
      }
    });
  },

  //立即购买
  buyNow: function () {
    //   if (this.data.colorActive == -1) {
    //     app.showToast('请选择颜色分类~', this, 3000);
    //   } else if (this.data.priceTypeActive == -1) {
    //     app.showToast('请选择价格规格~', this, 3000);
    //   } else {
    //     var that = this;
    //     wx.request({
    //       url: that.data.domain + '/api/goodsCart',
    //       data: {
    //         goodsVO:{

    //         }
    //         "userId": 12,
    //         "goodsId": this.data.productId,
    //         "colorId": this.data.colorActive,
    //         "goodsNum": this.data.inputNum,
    //         "specId": this.data.priceTypeActive
    //       },
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       method: 'POST',
    //       success: function (res) {
    //         if (res.data.statusCode == 200) {
    //           that.hideDialog();
    //           app.showToast('添加成功，在购物车等亲~', that, 5000);
    //         } else {
    //           app.showToast('嗷嗷，购物车添加失败~', that, 3000);
    //         }
    //       },
    //       fail: function () {
    //         console.log("失败");
    //       }
    //     });
    //   }
  },
})