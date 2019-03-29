function ajax(options, callBack){
    // 创建ajax对象
    var xhr = null;
    var _ops = {
      method: 'get',
      url: '',
      data: {},
      contentType: "application/x-www-form-urlencoded"
    }
    for (key in options) {
      _ops[key] = options[key]
    }
    var type = _ops.method.toUpperCase();
    // 用于清除缓存
    var random = Math.random();
    var data = _ops.data
    var url = _ops.url

    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    if(typeof data == 'object'){
        var str = '';
        for(var key in data){
            str += key+'='+data[key]+'&';
        }
        data = str.replace(/&$/, '');
    }
    console.log(_ops);
    if(type == 'GET'){
        if(data){
            xhr.open('GET', url + '?' + data, true);
        } else {
            xhr.open('GET', url + '?t=' + random, true);
        }
        xhr.send();

    } else if(type == 'POST'){
        xhr.open('POST', url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", _ops.contentType);
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                callBack(xhr.responseText);
            } else {
                callBack(xhr.status);
            }
        }
    }
}

// es6语法糖封装
const promiseAjax = (options) =>
  new Promise((resolve, reject) =>{
          // 创建ajax对象
          var xhr = null;
          var _ops = {
            method: 'get',
            url: '',
            data: {},
            contentType: "application/x-www-form-urlencoded"
          }
          Object.assign(_ops, options);
          var type = _ops.method.toUpperCase();
          // 用于清除缓存
          var random = Math.random();
          var data = _ops.data
          var url = _ops.url

          if(window.XMLHttpRequest){
              xhr = new XMLHttpRequest();
          } else {
              xhr = new ActiveXObject('Microsoft.XMLHTTP')
          }
          if(typeof data == 'object'){
              var str = '';
              for(var key in data){
                  str += key+'='+data[key]+'&';
              }
              data = str.replace(/&$/, '');
          }
          console.log(_ops);
          if(type == 'GET'){
              if(data){
                  xhr.open('GET', url + '?' + data, true);
              } else {
                  xhr.open('GET', url + '?t=' + random, true);
              }
              xhr.send();

          } else if(type == 'POST'){
              xhr.open('POST', url, true);
              // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
              xhr.setRequestHeader("Content-type", _ops.contentType);
              xhr.send(data);
          }

          // 处理返回数据
          xhr.onreadystatechange = () =>{
              if(xhr.readyState == 4){
                  if(xhr.status == 200){
                      resolve(xhr.responseText);
                  } else {
                      reject(xhr.status);
                  }
              }
          }
    });
