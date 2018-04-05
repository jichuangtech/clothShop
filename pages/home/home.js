//homde.js
//获取应用实例
var app = getApp();

Page({
  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    productType:[],
    recommendList:[],
    adImgRes: ['../res/img/benchi.jpg', '../res/img/iphone.jpg'],
    loadMark:true,
    loadTip:"正在努力加载数据...",
    hotProList:[],
    hotProTip:"正在获取热销商品...",
    hotProMark: true,
    
  },
  onLoad: function () {
    
  },

  onShareAppMessage: function(res) {
    if (res.from == 'menu') {
      console.log("右上角的菜单跳转");
    }

    return {
      title: '金凤针织',
      path: '/page/home',
      imageUrl:'/images/icon/home.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onReady:function(){
    this.getProductType();
    this.getHotProduct();
    this.getRecommend();
  },
  //获取商品类型
  getProductType:function(){
    var that = this;
    wx.request({
      url: that.data.domain +'/api/goodsCategories', 
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function () {
            that.getProductType();
          });
        } else if (app.isSuccess(res.data.statusCode)) {
          that.setData({
            loadMark: false,
            productType: res.data.data
          });
        } else{
          that.setData({
            loadTip: "暂时没有数据"
          });
        }
      },
      fail: function () {
        that.setData({
          loadTip: "网络连接失败"
        });
      }
    });
  },

  //获取热销商品
  getHotProduct:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goods/hot',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        console.log(JSON.stringify(res.data));
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function () {
            that.getHotProduct();
          });
        } else if (app.isSuccess(res.data.statusCode)) {
          that.setData({
            hotProMark: false,
            hotProList: res.data.data
          });
        } else {
          that.setData({
            hotProTip: "暂时无热销商品"
          });
        }
      },
      fail: function () {
        that.setData({
          hotProTip: "网络连接失败"
        });
      }
    });
  },

  //获取推荐商品
  getRecommend:function(){
    var recommendList = [],
        that = this;
    wx.request({
      url: that.data.domain + '/api/goods/recommend',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        if (app.isShouldLogin(res.data.statusCode)) {
          app.doLogin(function () {
            that.getRecommend();
          });
        } else if (app.isSuccess(res.data.statusCode)) {
          for (var i = 0; i < res.data.data.length; i++) {
            recommendList[i] = res.data.data[i];
            i++;
            if (i == 3) {
              break;
            }
          }
        } 
        that.setData({
          recommendList: recommendList
        });
        
      },
      fail: function () {
        console.log("网络连接失败");
      }
    });
  }
})
