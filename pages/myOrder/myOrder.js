// myOrder.js
var app = getApp();
Page({
  data: {
    domain: app.globalData.config.domain,
    tabInfo: [
      {tabName: '全部', tabStatus: 0},
      {tabName: '待支付', tabStatus: 1},
      {tabName: '待发货', tabStatus: 2},
      {tabName: '待收货', tabStatus: 3 },
      {tabName: '已完成', tabStatus: 4},
    ],
    orderList:[],
    currentId:0,
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
        currentId: options.orderStatus
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
        currentId: id
      })
    }
    this.getOrderList();
  },

  //获取订单
  getOrderList:function(e){
    var that = this;
    var token = wx.getStorageSync("token");
    wx.request({
      url: 'http://172.20.10.3:8070/api/order/16777215/'+that.data.currentId+'',
      // url: that.data.domain + '/api/order/16777215/' + that.data.currentId + '',
      header: {
        'content-type': 'application/json',
        'access_token': token
      },
      method: 'GET',
      success: function (res) {
        console.log("getOrder res.data: " + JSON.stringify(res.data));
        that.setData({
          orderList: res.data.data
        });
        if (that.data.orderList){
          that.setData({
            loadMark: false
          });
        }else{
          that.setData({
            loadMark: true,
            loadTip: "暂时无对应的数据"
          });
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
        'content-type': 'application/json'
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
  }
})