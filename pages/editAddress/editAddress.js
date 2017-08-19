//index.js
//获取应用实例
var app = getApp(),
  city = require("../../utils/citys.js"),
  util = require("../../utils/util.js");

var app = getApp()
Page({
  data: {
    domain: app.config.domain,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countrys: [],
    country: '',
    provinceId: 110000,
    cityId: 110000,
    districtId: 110101,
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    infoObj: [
      {
        text: "",
        mark: false,
        tip: "姓名为长度不大于20位的中文或字母"
      },
      {
        text: "",
        mark: false,
        tip: "请输入正确的手机号"
      },
      {
        text: "",
        mark: false,
        tip: "详细地址不能为空"
      },
    ],
    receiverName: "",
    phone: "",
    detailAddress: "",
    isDefault: 0
  },

  //输入框的输入
  inputInfo: function (e) {
    var text = e.detail.value.trim(),
      inputType = e.target.dataset.type,
      mark = true,
      newInfoObj = this.data.infoObj;
    console.log("text:" + text);
    console.log("inputType:" + inputType);
    if (inputType == 0) {//姓名
      if (!util.formatName(text)) {
        app.showToast(this.data.infoObj[inputType]['tip'], this);
        mark = false;
      }
    } else if (inputType == 1) {//电话
      if (!util.formatPhone(text)) {
        app.showToast(this.data.infoObj[inputType]['tip'], this);
        mark = false;
      }
    } else {//详细地址
      if (text.length == 0) {
        app.showToast(this.data.infoObj[inputType]['tip'], this);
        mark = false;
      }
    }
    if (mark) {
      newInfoObj[inputType]['text'] = text;
      newInfoObj[inputType]['mark'] = true;
      this.setData({
        infoObj: newInfoObj
      })
    }
  },

  //选择省地市
  bindChange: function (e) {
    var val = e.detail.value,
      t = this.data.values,
      cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countrys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push({ 'name': cityData[val[0]].sub[i].name, 'code': cityData[val[0]].sub[i].code });
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countrys.push({ 'name': cityData[val[0]].sub[0].sub[i].name, 'code': cityData[val[0]].sub[0].sub[i].code });
      }
      this.setData({
        province: this.data.provinces[val[0]]['name'],
        provinceId: this.data.provinces[val[0]]['code'],
        city: cityData[val[0]].sub[0]['name'],
        cityId: cityData[val[0]].sub[0]['code'],
        citys: citys,
        country: cityData[val[0]].sub[0].sub[0]['name'],
        districtId: cityData[val[0]].sub[0].sub[0]['code'],
        countrys: countrys,
        values: val,
        value: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      const countrys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countrys.push({ 'name': cityData[val[0]].sub[val[1]].sub[i].name, 'code': cityData[val[0]].sub[val[1]].sub[i].code });
      }
      this.setData({
        city: this.data.citys[val[1]]['name'],
        cityId: this.data.citys[val[1]]['code'],
        country: cityData[val[0]].sub[val[1]].sub[0]['name'],
        districtId: cityData[val[0]].sub[val[1]].sub[0]['code'],
        countrys: countrys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('country no');
      this.setData({
        country: this.data.countrys[val[2]]['name'],
        districtId: this.data.countrys[val[2]]['code'],
        values: val
      })
      return;
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function (options) {
    var that = this;
    city.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countrys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push({ 'name': cityData[i].name, 'code': cityData[i].code });
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push({ 'name': cityData[0].sub[i].name, 'code': cityData[0].sub[i].code });
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countrys.push({ 'name': cityData[0].sub[0].sub[i].name, 'code': cityData[0].sub[0].sub[i].code });
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countrys': countrys,
      'province': cityData[0].name,
      'provinceId': cityData[0].code,
      'city': cityData[0].sub[0].name,
      'cityId': cityData[0].sub[0].code,
      'country': cityData[0].sub[0].sub[0].name,
      'districtId': cityData[0].sub[0].sub[0].code
    })
  },

  //保存地址
  saveAddress: function () {
    var that = this;
    for (var i = 0; i < that.data.infoObj.length; i++) {
      if (!that.data.infoObj[i]['mark']) {
        app.showToast(that.data.infoObj[i]['tip'], that);
        return false
      }
    }
    wx.request({
      url: that.data.domain + '/api/useraddress/address',
      data: {
        "userId": 16777215,
        "consignee": that.data.infoObj[0]['text'],
        "province": that.data.provinceId,
        "city": that.data.cityId,
        "district": that.data.districtId,
        "address": that.data.infoObj[2]['text'],
        "zipcode": "361000",
        "mobile": that.data.infoObj[1]['text'],
        "isDefault": that.data.isDefault
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log("保存成功");
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //设置默认地址
  setDefault:function(e){
    var isDefault = 1;
    if (this.data.isDefault){
      isDefault = 0;
    }
    this.setData({
      isDefault:isDefault
    })
  }

})
