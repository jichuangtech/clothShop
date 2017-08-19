// shoppingCar.js
var app = getApp();
Page({
  data: {
    domain: app.config.domain,
    test:false,
    pro:[
      // { name: '专人配送', value: '0', checked: false,price:12.12,num:1 },
      // { name: '专人配送', value: '1', checked: false, price: 12, num: 2 },
      // { name: '精品品牌', value: '2', checked: false, price: 10.2, num: 3 }
    ],
    savePro:[],
    allMoney:0.00,
    allSelect:false,
    editObj:{
      editMark:false,
      editText:"编辑"
    },
    load:{
      loadTip: "正在加载购物车...",
      loadMark:true
    },
    footerBtn:{
      btnText:"结算"
    },
    toast:{
      toastMark:false,
      toastText:""
    }
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
    this.getShoppingCar();
  },
  onShow: function () {
  },

  //请求购物车
  getShoppingCar:function(){
    var that = this,
        loadMark = true,
        loadTip = "购物车空空如也";
    wx.request({
      url: that.data.domain + '/api/goodsCart/12',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if(res.data.length!=0){
          // for(var i=0;i<res.data.length;i++){
          //   res.data[i]['value'] = i;
          // }
          that.setData({
            pro: res.data,
            savePro:res.data
          });
          loadMark = false;
        }
        that.setData({
          load: {
            loadMark: loadMark,
            loadTip: loadTip
          }
        });
      },
      fail: function () {
        loadMark = false;
        loadTip = "网络连接失败";
        that.setData({
          load: {
            loadMark: loadMark,
            loadTip: loadTip
          }
        });
      }
    });
  },

  //勾选商品
  selectPro:function(e){
    var pro = this.data.pro,
        checkArr = e.detail.value,
        allMoney = 0,
        countIndx = 0,
        allSelect = false;
    console.log("checkArr:" +checkArr);
    for (var i = 0; i < pro.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        console.log("相加");
        console.log(i + "");
        pro[i].checked = true;
        console.log("当前1");
        allMoney = (parseFloat(allMoney) + parseFloat(pro[i].goodsNum * pro[i].shopPrice)).toFixed(2);
        
        pro[i].checked = true;
        console.log("选中");
        countIndx++
      } else {
        console.log("未选中");
        pro[i].checked = false;
      }
    }
    if (countIndx == pro.length){
      allSelect = true;
    }
    this.setData({
      pro: pro,
      allMoney: allMoney,
      allSelect: allSelect
    })

  },
  //全选或反选
  selectAll:function(){
    var pro = this.data.pro,
        mark = false,
        allSelect = false;
    if (this.data.pro.length == 0) {
      return false;
    }
    if (!this.data.allSelect){
      mark = true;//全部选中
      allSelect = true;
    }
    for (var i = 0; i < pro.length; i++) {
      pro[i].checked = mark;
    }
    this.setData({
      pro: pro,
      allSelect: allSelect
    })
  },

  //编辑购物车
  editCarList:function(){
    var that = this,
        editMark = false,
        editText =  "编辑";
    console.log("测试："+that.data.editObj.editMark);
    if (that.data.pro.length == 0) {
      return false;
    }
    if(!that.data.editObj.editMark){//切换至可编辑状态
        editMark = true;
        editText = "完成";
    }else{
      if (that.data.pro.length != 0){//判断是否有修改数量
        var editPro = [];
        for(var i = 0; i <that.data.pro.length;i++){
          for (var j = 0; j < that.data.savePro.length;j++){
            if (pro[i]['goodsNum'] != savePro[j]['goodsNum']){
              editPro.push(pro[i]["goodsCartId"]);
              editPro.push(pro[i]["goodsNum"]);
              break;
            }
          }
        }
        if(editPro.length!=0){//数量有修改
          that.editCarItem(editPro);
        }
      }
    }
    that.setData({
      editObj:{
        editMark: editMark,
        editText: editText
      },
      footerBtn:{
        btnText:"删除"
      }
    })
    that.selectAll();
  },

  //删除购物车
  delCarItem:function(e){
    var that = this,
        carId = e.currentTarget.dataset.carid;
    wx.request({
      url: that.data.domain + '/api/goodsCart/' + carId+'',
      header: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
      success: function (res) {
        if(res.data.statusCode==200){
          app.showToast('删除成功', that, 3000);
          that.onReady();
        }else{
          app.showToast('删除失败', that, 3000);
        }
      },
      fail: function () {
        console.log("注册失败");
      }
    });
  },

  //编辑购物车
  editCarItem: function (params) {
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goodsCart/goodsNumber',
      data:{
        obj: params
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
      success: function (res) {
        if (res.data.statusCode == 200) {
          console.log("修改数量成功");
          that.onReady();
        } else {
          console.log("修改数量成功");
        }
      },
      fail: function () {
        console.log("注册失败");
      }
    });
  },
  //购买数量增减
  setNum: function (e) {
    var that = this,
        btnType = e.currentTarget.dataset.type,
        index = e.currentTarget.dataset.index,
        proList = that.data.pro,
        num = that.data.pro[index]['goodsNum'],
        storeCount = that.data.pro[index]['storeCount'];
    if(btnType == 1) {
      if (num == 1) {
        return false;
      }
      num = num - 1;
    }else{
      num = num + 1;
    }
    if (num > parseInt(storeCount)) {
      app.showToast('嗷嗷，库存不足哦~', that, 3000);
      num = storeCount;
    }
    proList[index]['goodsNum'] = num;
    that.setData({
      pro: proList
    })
    console.log("数量赋值：" + JSON.stringify(this.data.goodsVO));
  }
})