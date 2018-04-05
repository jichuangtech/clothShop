//demo.js
//进行demo测试

Page({
  data : {
    title: 'demo'
  },

  chooseImg: function() {
    console.log("图片预览");

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },

  prevImg: function() {
    console.log("图片预览");

    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  },

  showLoading: function() {
    // wx.showLoading({
    //   title:'正在加载'
    // });

    // wx.showModal({
    //   title:'我是提示',
    //   content:'请输入密码 '
    // });

    // wx.showNavigationBarLoading()

    wx.openSetting({
      
    });
  }


})
