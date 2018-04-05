// myOrder.js
var app = getApp();
Page({
  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
    tabInfo: [
      {tabName: '全部', tabStatus: 0},
      {tabName: '待支付', tabStatus: 1},
      {tabName: '待发货', tabStatus: 2},
      {tabName: '待收货', tabStatus: 3 },
      {tabName: '已完成', tabStatus: 4},
    ],
    orderList:[],
    orderStatus:0,
    loadMark:true,
    loadTip:"正在加载数据..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("获取：" + options.orderStatus);
    if (options.orderStatus){
      this.setData({
        orderStatus: options.orderStatus
      });
    }
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   // this.getOrderList();
  },

  //触发订单状态
  checkStatus:function(e){
    if (e) {
      let id = e.currentTarget.dataset.status;
      this.setData({
        orderStatus: id
      })
    }
    this.getOrderList();
  },

  //获取订单
  getOrderList:function(e){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/order/16777215/' + that.data.orderStatus + '',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        var statusCode = res.data.statusCode;
        if(app.isShouldLogin(statusCode)) {
          app.doLogin(function() {
            that.getOrderList();
          });
        } else if (app.isSuccess(statusCode)) {
          
          if(res.data.data.length != 0) {
            that.setData({
              orderList: res.data.data,
              loadMark: false
            });
          } else {
            that.setData({
              orderList: res.data.data,
              loadMark: true,
              loadTip: "暂时无对应的数据"
            });
          }
        } else {
          app.showToast('嗷嗷，订单查询失败~', that);
          console.error("get order error msg: " + res.data.msg);
        }
      },
      fail: function () {
        that.setData({
          loadMark: true,
          loadTip: "数据加载失败"
        });
      }
    });
  },

  //确认收货
  changeStatus:function(e){
    var that = this,
      orderId = e.currentTarget.dataset.id;
    wx.request({
      
      url: that.data.domain + '/api/order/16777215/orderstatus/'+orderId+'/4',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'POST',
      success: function (res) {
        if (res.data.statusCode==200){
          app.showToast('确认成功', that);
          that.getOrderList();
        }else{
          app.showToast('确认失败', that);
        }
      },
      fail: function () {
        console.log("确认收货fail");
      }
    });
  },

  pay: function (event) {
    var that = this;
    var orderInfo = event.target.dataset.info;
    app.doWxPay(orderInfo,
      function () {
        that.getOrderList();
      },
      function () {
        console.error("order Detail pay error");
      });
  }
})