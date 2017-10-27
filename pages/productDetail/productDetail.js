// productDetail.js
var app = getApp();
Page({
  data: {
    domain: app.globalData.config.domain,
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
        'access_token': app.globalData.token
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          productInfo: res.data,
          storeCount: res.data.storeCount,
          colorActive: res.data.goodsColors[0]['colorId'],
          priceTypeActive: res.data.goodsSpecs[0]['specId']
        });
      },
      fail: function () {
        console.log("注册失败");
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
  inputNum: function (e) {
    let num = e.detail.value.trim();
    console.log("监听输入："+num);
    if(!/^[1-9][0-9]$/.test(num)){
      num = 1;
    }else if (num > parseInt(this.data.storeCount)) {
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
   
    if (this.data.colorActive==-1){
      app.showToast('请选择颜色分类~', this);
    }else if (this.data.priceTypeActive==-1){
      app.showToast('请选择价格规格~', this);
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
        'access_token': app.globalData.token
      },
      method: 'POST',
      success: function (res) {
        if (res.data.statusCode == 200) {
          that.hideDialog();
          that.setDefalutDia();
          app.showToast('添加成功，在购物车等亲~', that);
        } else {
          app.showToast('嗷嗷，购物车添加失败~', that);
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //订单确认页面
  confirmOrder:function(){
    var proInfo = [];
    var proItem = {
      productId: this.data.productInfo.goodsId,
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