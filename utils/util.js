function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatPhone(phone){
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  }
  else {
    return true;
  }
}

function formatName(name){
  var mark = /^[\u4E00-\u9FA5]{1,20}$/.test(name);
  if(mark) {
    return true;
  }else{
    mark = /^[a-zA-Z]{1,20}$/.test(name);
    if(mark) {
      return true;
    }else{
      return false;
    }
  }
}

module.exports = {
  formatTime: formatTime,
  formatPhone: formatPhone,
  formatName: formatName
}
