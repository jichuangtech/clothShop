// productDetail.js
var app = getApp();
Page({
  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    productInfo:{},
    dialogMark:0,
    storeCount:0,
    inputNum:1,
    productId:"",
    colorActive: -1,
    colorName:"",
    priceTypeActive: -1,
    price:0,
    priceTypeName:"",
    btnObj:{
      btnType:-1,
      btnMark:false
    }
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
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function () {
            that.getProductDetail();
          });
        } else if (app.isSuccess(res.data.statusCode)){
          let goods = res.data.data;
          that.setData({
            productInfo: goods,
            storeCount: goods.storeCount,
            colorActive: goods.goodsColors[0]['colorId'],
            priceTypeActive: goods.goodsSpecs[0]['specId']
          });
        } else {
          app.showToast('商品数据获取失败：' + res.data.msg , that);
          console.error("获取商品失败, msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.log("获取商品详情失败");
      }
    });
  },

  //触发弹框
  openDialog:function(e){
    var btnMark = e.currentTarget.dataset.type ? true:false;
    this.setData({
      dialogMark: 1,
      btnObj:{
        btnType: btnMark,
        btnType: e.currentTarget.dataset.type
      }
    })
    console.log("类型"+this.data.btnType);
  },
  //关闭弹框
  hideDialog:function(e){
    console.log("隐藏");
    this.setData({
      dialogMark:0
    })
    this.setDefalutDia();
  },

  //输入框数据
  bindChange: function (e) {
    let num = e.detail.value.trim();
    console.log("监听输入："+num);
    // if(!/^[1-9][0-9]$/.test(num)){
    //   num = 1;
    // }
    if (num > parseInt(this.data.storeCount)) {
      app.showToast('嗷嗷，库存不足哦~', this);
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
      app.showToast('嗷嗷，库存不足哦~', this);
      num = this.data.storeCount;
    }
    this.setData({
      inputNum: num,
    })
    console.log("数量赋值：" + JSON.stringify(this.data.goodsVO));
    
  },

  //选择颜色与价格规格
  chooseType:function(e){
    var id = e.currentTarget.dataset.id,
        name = e.currentTarget.dataset.name,
        price = e.currentTarget.dataset.price,
        clickType = e.currentTarget.dataset.type;
    if (clickType==1){
      this.setData({
        colorActive: id,
        colorName: name
      })
    }else{
      this.setData({
        priceTypeActive: id,
        priceTypeName: name,
        price: price
      })
    }
  },

  //加入购物车或是立即购买或是确定
  confirmDialog:function(e){
    if (this.data.inputNum == 0 || this.data.inputNum == ""){
      app.showToast('请输入数量', this);
    }else{
      if (this.data.btnObj.btnType==1){//加入购物车
        this.addShoppingCar();
      }else{
        this.confirmOrder();
      }
    }
  },

  //加入购物车
  addShoppingCar(){
    var that = this;
    if (this.data.inputNum == 0 || this.data.inputNum == "") {
      app.showToast('请输入数量', this);
      return false;
    }
    wx.request({
      url: that.data.domain + '/api/goodsCart',
      data: {
        "userId": 12,
        "goodsId": this.data.productId,
        "colorId": this.data.colorActive,
        "goodsNum": this.data.inputNum,
        "specId": this.data.priceTypeActive
      },
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'POST',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function() {
            that.addShoppingCar();
          });
        } else if (app.isSuccess(res.data.statusCode)) {
          that.hideDialog();
          that.setDefalutDia();
          app.showToast('添加成功，在购物车等亲~', that);
        } else {
          app.showToast('嗷嗷，购物车添加失败~', that);
          console.error("add goods cart error msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.error("失败");
      }
    });
  },

  //订单确认页面
  confirmOrder:function(){
    var proInfo = [];
    if (this.data.inputNum == 0 || this.data.inputNum == "") {
      app.showToast('请输入数量', this);
      return false;
    }
    var proItem = {
      goodsId: this.data.productInfo.goodsId,
      goodsName: this.data.productInfo.goodsName,
      originalImg: this.data.productInfo.originalImg,
      goodsNum: this.data.inputNum,
      colorId: this.data.colorActive,
      color: this.data.colorName,
      specId: this.data.priceTypeActive,
      specName: this.data.priceTypeName,
      shopPrice: this.data.price
    };
    proInfo.push(proItem);
    wx.setStorageSync('proInfo', proInfo);
    wx.navigateTo({
      url: "../confirmOrder/confirmOrder"
    })
  },

  //弹框内容初始化
  setDefalutDia:function(){
    this.setData({
      colorActive: -1,
      priceTypeActive: -1,
      inputNum:1
    })
  }
})