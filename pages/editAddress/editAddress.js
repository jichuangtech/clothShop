//index.js
//获取应用实例
var city = require("../../utils/citys.js");

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
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    receiverName:"",
    phone:"",
    provinceId: 110000,
    cityId: 110000,
    districtId: 110101,
    detailAddress:"",
    isDefault:0
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
        citys.push({ 'name': cityData[val[0]].sub[i].name, 'code':cityData[val[0]].sub[i].code});
     //   citys.push(cityData[val[0]].sub[i].name);
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countrys.push({ 'name': cityData[val[0]].sub[0].sub[i].name, 'code': cityData[val[0]].sub[0].sub[i].code});
       // countrys.push(cityData[val[0]].sub[0].sub[i].name);
      }
      this.setData({
        province: this.data.provinces[val[0]]['name'],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        country: cityData[val[0]].sub[0].sub[0].name,
        countrys: countrys,
        values: val,
        value: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countrys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countrys.push({ 'name': cityData[val[0]].sub[val[1]].sub[i].name, 'code': cityData[val[0]].sub[val[1]].sub[i].code});
     //   countrys.push(cityData[val[0]].sub[val[1]].sub[i].name);
      }

      this.setData({
        city: this.data.citys[val[1]]['name'],
        country: cityData[val[0]].sub[val[1]].sub[0].name,
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
    console.log("类型：" + options.addressId);
    var that = this;
    city.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countrys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push({ 'name': cityData[i].name, 'code': cityData[i].code});
      // provinces.push(cityData[i].name);
      // provinces.push(cityData[i].code);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push({ 'name': cityData[0].sub[i].name, 'code': cityData[0].sub[i].code});
      // citys.push(cityData[0].sub[i].name);
      // citys.push(cityData[0].sub[i].code);
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countrys.push({ 'name': cityData[0].sub[0].sub[i].name, 'code': cityData[0].sub[0].sub[i].code});
      // countrys.push(cityData[0].sub[0].sub[i].name);
      // countrys.push(cityData[0].sub[0].sub[i].code);
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countrys': countrys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'country': cityData[0].sub[0].sub[0].name
    })

    console.log("province:" + this.data.province);
    console.log("provinces:" + this.data.provinces);
  },

  //保存地址
  saveAddress:function(){

    var that = this;
    wx.request({
      url: that.data.domain + '/api/useraddress/address',
      data: {
        "userId": 16777215, 
        "consignee": "张晓雪", 
        "province": 350000, 
        "city": 350200,
        "district": 350203, 
        "address": "瑞景商业广场", 
        "zipcode": "361000",
        "mobile": "18850541234",
        "isDefault": 1 
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
  }

})
