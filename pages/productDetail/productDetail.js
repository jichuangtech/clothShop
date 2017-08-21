// productDetail.js
var app = getApp();
Page({
  data: {
    domain: app.config.domain,
    productInfo:{},
    dialogMark:0,
    storeCount:0,
    inputNum:1,
    productId:"",
    colorActive:-1,
    priceTypeActive:-1
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      productId: options.id
    });
  },

  onReady: function () {
    this.getProductDetail();
  },

  onShow: function () {
  
  },

  //获取商品详情
  getProductDetail:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goods/' + that.data.productId+'',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          productInfo: res.data,
          storeCount: res.data.storeCount
        });
      },
      fail: function () {
        console.log("注册失败");
      }
    });
  },

  //触发弹框
  chooseColors:function(e){
    this.setData({
      dialogMark: 1
    })
  },
  hideDialog:function(e){
    console.log("隐藏");
    this.setData({
      dialogMark:0
    })
  },

  //输入框数据
  inputNum: function (e) {
    let num = e.detail.value.trim();
    console.log("监听输入："+num);
    if(!/^[1-9][0-9]$/.test(num)){
      num = 1;
    }else if (num > parseInt(this.data.storeCount)) {
      app.showToast('嗷嗷，库存不足哦~', this, 3000);
      num = this.data.storeCount;
    }
    this.setData({
      inputNum: num
    })
  },

  //购买数量增减
  setNum:function(e){
    let type = e.currentTarget.dataset.type,
      num = this.data.inputNum;
    if(type==1){
      if (this.data.inputNum == 1) {
        return false;
      }
      num =num - 1;
    }else{
      num = num + 1;
    }
    if (num > parseInt(this.data.storeCount)){
      app.showToast('嗷嗷，库存不足哦~', this, 3000);
      num = this.data.storeCount;
    }
    this.setData({
      inputNum: num,
    })
    console.log("数量赋值：" + JSON.stringify(this.data.goodsVO));
    
  },

  //选择颜色与价格规格
  chooseType:function(e){
    let id = e.currentTarget.dataset.id,
        type = e.currentTarget.dataset.type;
    if(type==1){
      this.setData({
        colorActive: id
      })
    }else{
      this.setData({
        priceTypeActive: id
      })
    }
  },

  //加入购物车
  addShoppingCar:function(e){
    if (this.data.colorActive==-1){
      app.showToast('请选择颜色分类~', this, 3000);
    }else if (this.data.priceTypeActive==-1){
      app.showToast('请选择价格规格~', this, 3000);
    }else{
      var that = this;
      wx.request({
        url: that.data.domain + '/api/goodsCart',
        data:{
            "userId": 12,
            "goodsId": this.data.productId,
            "colorId": this.data.colorActive,
            "goodsNum": this.data.inputNum,
            "specId": this.data.priceTypeActive
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.statusCode==200){
            that.hideDialog();
            app.showToast('添加成功，在购物车等亲~', that, 5000);
          }else{
            app.showToast('嗷嗷，购物车添加失败~', that, 3000);
          }
        },
        fail: function () {
        console.log("失败");
        }
      });
    }
  },

  //立即购买
  buyNow:function(){
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
   }
})