// productList.
var app = getApp();
Page({

  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    typeId:"",
    title:"",
    list:"",
    loadMark:true,
    loadTip:"正在加载数据"
  },

  onLoad: function (options) {
    console.log("88:" + options.productName);
    var that = this;
    that.setData({
      title: options.productName,
      typeId:options.id
    });

    wx.setNavigationBarTitle({
      title: that.data.title//页面标题为路由参数
    })
  },
   
  onReady: function () {
    this.getProductList();
  },

  onShow: function () {
  
  },

  //获取产品
  getProductList(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goodsCategories/' + that.data.typeId+'/goods',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        var products = res.data;
        

        if(app.isShouldLogin(res.data.statusCode)){
          app.doLogin(function() {
            that.getProductList();
          });
        } else if (app.isSuccess(res.data.statusCode)){
          if (products.data.length != 0) {
            that.setData({
              list: products.data, 
              loadMark: false
            });
          } else{
            that.setData({
              loadMark: true,
              loadTip: "暂时没有数据"
            });
          }
        } else {
          that.setData({
            loadMark: true,
            loadTip: products.msg
          });
        }
      },
      fail: function () {
        loadMark: true,
        console.log("数据加载数据");
      }
    });
  }
})