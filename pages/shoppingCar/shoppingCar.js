// shoppingCar.js
var app = getApp();
Page({
  data: {
    domain: app.config.domain,
    pro:[],
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
    btnText:"结算",
    toast:{
      toastMark:false,
      toastText:""
    }
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  },
  onShow: function () {
    this.getShoppingCar();
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
        var data = res.data;
        if(res.data.length!=0){
          loadMark = false;
        }else{
          that.setData({
            allSelect:false,
            editObj: {
              editMark: false,
              editText: "编辑"
            },
            btnText:"结算"
          })
        }
        that.setData({
          pro: data,
          savePro: data,
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
        console.log(i + "");
        pro[i].checked = true;
        allMoney = (parseFloat(allMoney) + parseFloat(pro[i].goodsNum * pro[i].shopPrice)).toFixed(2);
        
        pro[i].checked = true;
        countIndx++
      } else {
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
  selectAll: function (e){
    var selectType = ""
    if(e){
      selectType = e.currentTarget.dataset.type;
      console.log("selectType:" + JSON.stringify(e));
      console.log("selectType:" + selectType);
    }
    var that = this,
        pro = this.data.pro,
        mark = false,
        allSelect = false,
        allMoney = 0;
   
    if (!this.data.allSelect){
      mark = true;//全部选中
      allSelect = true;
      for (var i = 0; i < pro.length; i++) {
        allMoney = (parseFloat(allMoney) + parseFloat(pro[i].goodsNum * pro[i].shopPrice)).toFixed(2);
      }
    }
    for (var i = 0; i < pro.length; i++) {
      pro[i].checked = mark;
    }
    console.log("allSelect:" + allSelect);
    
    this.setData({
      pro: pro,
      allSelect: allSelect,
      allMoney: allMoney
    })
  },

  //编辑购物车
  editCarList:function(){
    var that = this,
        editMark = false,
        editText =  "编辑",
        btnText = "结算",
        allSelect = 0;
    
    if(!that.data.editObj.editMark){//文案由'编辑'-》'完成'状态
        editMark = true;
        editText = "完成";
        btnText = "删除";
    }else{
      if (that.data.pro.length != 0){//判断是否有修改数量
        var editPro = [];
        for(var i = 0; i <that.data.pro.length;i++){
          for (var j = 0; j < that.data.savePro.length;j++){
            if(that.data.pro[i]['goodsCartId'] == that.data.savePro[j]['goodsCartId']){
              if (that.data.pro[i]['goodsNum'] != that.data.savePro[j]['goodsNum']){
                var newPro = {
                  goodsCartId: that.data.pro[i]["goodsCartId"],
                  goodsNum: that.data.pro[i]["goodsNum"]
                };
                console.log("修改："+JSON.stringify(newPro));
                editPro.push(newPro);
                break;
              }
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
      btnText: btnText
    })
  },

  //删除购物车
  delCar:function(param){
    var that = this;
    console.log("param:" + param);
    wx.request({
      url: that.data.domain + '/api/goodsCart/',
      data:{
        cartIds: param
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
      success: function (res) {
        if (res.data.statusCode == 200) {
          app.showToast('删除成功', that);
          that.setData({
            allMoney:0
          })
          // that.onReady();
          that.onShow();
        } else {
          app.showToast('删除失败', that);
        }
      },
      fail: function () {
        console.log("注册失败");
      }
    });
  },
  //点击每一项删除
  delCarItem:function(e){
    var that = this,
        carId = e.currentTarget.dataset.carid,
        proIds = [];
    proIds.push(carId);
    that.delCar(proIds);
  },

  //编辑购物车
  editCarItem: function (params) {
    console.log("修改数组params:"+params);
    var that = this;
    wx.request({
      url: that.data.domain + '/api/goodsCart/goodsNumber',
      data:{
        cartNumberVOList: params
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
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
  },

  //结算或是删除
  carBtn:function(){
    var that = this,
        pro = that.data.pro,
        countIndx = 0,
        proIds = [];
    for (var i = 0; i < pro.length; i++) {
      if (pro[i].checked) {
        countIndx++;
        proIds.push(pro[i]['goodsCartId']);
        console.log("选中了:"+countIndx);
      } 
    }
    if(countIndx==0){
      app.showToast('请勾选商品', that);
      return false;
    }
    
    if (that.data.editObj.editMark){//
      that.delCar(proIds);
      console.log("删除");
    }else{
      console.log("结算");
    }
  }
})