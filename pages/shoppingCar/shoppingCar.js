// shoppingCar.js
var app = getApp();
Page({
  data: {
    domain: app.globalData.config.domain,
    photoDomain: app.globalData.config.photoDomain,
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
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (app.isShouldLogin(res.data.statusCode)){
          app.doLogin(function() {
            that.getShoppingCar();
          });
          that.setData({
            allSelect: false,
            editObj: {
              editMark: false,
              editText: "编辑"
            },
            btnText: "结算"
          })
        } else if(app.isSuccess(res.data.statusCode)) {
          that.setData({
            pro: data.data,
            savePro: data.data,
            load: {
              loadMark: false,
              loadTip: loadTip
            }
          });
        } else {
          that.setData({
            load: {
              loadMark: true,
              loadTip: data.msg
            }
          });
        }
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
        console.log("要被选");
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
        'content-type': 'application/json',
        'access_token': app.getToken()
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
        'content-type': 'application/json',
        'access_token': app.getToken()
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

  //输入框输入
  bindChange:function(e){
    console.log("输入"+JSON.stringify(e));
    var that = this,
        num = e.detail.value.trim();
        index = e.detail.index,
        isSelect = e.detail.select,
        proList = that.data.pro,
       // num = that.data.pro[index]['goodsNum'],
        storeCount = that.data.pro[index]['storeCount'];
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
  
  //购买数量增减
  setNum: function (e) {
    var that = this,
        btnType = e.currentTarget.dataset.type,
        index = e.currentTarget.dataset.index,
        isSelect = e.currentTarget.dataset.select,
        proList = that.data.pro,
        num = that.data.pro[index]['goodsNum'],
        nowNum = 0,
        storeCount = that.data.pro[index]['storeCount'];
      //  allMoney = that.data.allMoney - num * that.data.pro[index]['shopPrice'];
       // allMoney = (that.data.allMoney);
    if(btnType == 1) {
      if (num == 1) {
        return false;
      }
      nowNum = num - 1;
    }else{
      nowNum = num + 1;
    }
    if (nowNum > parseInt(storeCount)) {
      app.showToast('嗷嗷，库存不足哦~', that, 3000);
      nowNum = storeCount;
    }
    
    // if (isSelect == 1 && nowNum!=num){
    //   var nowMoney = (nowNum-num)*(that.data.pro[index]['shopPrice']);
    //   allMoney = (parseFloat(allMoney) + parseFloat(nowMoney)).toFixed(2);
    // }
    proList[index]['goodsNum'] = nowNum;
    // that.setData({
    //   pro: proList,
    //   allMoney: allMoney
    // })
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
        proIds = [],
        proSubmit = [];
    for (var i = 0; i < pro.length; i++) {
      if (pro[i].checked) {
        countIndx++;
        proIds.push(pro[i]['goodsCartId']);
        proSubmit.push(pro[i]);
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
      wx.setStorageSync("proInfo", proSubmit);
      wx.navigateTo({
        url: "../confirmOrder/confirmOrder"
      })
    }
  }
})