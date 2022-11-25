//  timestamp 时间戳
//  verificationStr 随机16位字符串
//  sign  MD5生成
import md5 from 'js-md5';
import qs from 'qs'
// 后端提供
const only = '@1245874158_@ZLOSHENRCK_@2147854854_#END';//普通接口请求的KEY，
// @7635278092@MNLSQISJZK @0983734623_#END
const business = '@2549625845_@USJDHEYSFL_@9014258749_#END';//业务接口请求的KEY，

//@7412584759_@BSNXHSKJZI_@4695187459_#END
// 随机16位字符串
function randomString () {
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < 16; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}
/**
 * 判断是否为空
 */
function empty (value) {
  switch (typeof value) {
    case 'undefined':
      return true;
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!value) return true;
      break;
    case 'number':
      // if (0 === value || isNaN(value)) return true;
      if (isNaN(value)) return true;
      break;
    case 'object':
      if (null === value || value.length === 0) return true;
      for (var i in value) {
        return false;
      }
      return true;
  }
  return false;
}

/**
 * 是否对象
 */
function object (value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
// 业务签名 字典排序 生成字符串
const ObjSort = function (arys) {
  // console.log('-----------------------0-');
  var str = "", newStr = "";
  // 判断是否为formData实例
  if (arys instanceof FormData) {
    str = 'moduleName' + '=' + arys.get('moduleName') + '&'
    newStr = md5(str + business).toLowerCase()
    // console.log('--------str + business-' + str + business);
  } else {
    if (object(arys)) {
      //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newkey = Object.keys(arys).sort();
      for (var i = 0; i < newkey.length; i++) {
        if (!empty(arys[newkey[i]])) {
          str += newkey[i] + "=" + arys[newkey[i]] + '&'
          //向新创建的对象中按照排好的顺序依次增加键值对
        }
      }
      // console.log('--------------------------------1-' + str + business);
      newStr = md5(str + business).toLowerCase()
    } else {
      newStr = md5(business).toLowerCase()
      // console.log('--------------------------------2-' + business);
    }
  }
  return newStr;
}
const configure = function (config) {
  // 时间戳
  const timestamp = new Date().getTime();//获取时间戳
  const verificationStr = randomString();//获取16位随机字符串
  const sign_ordinary = md5(verificationStr + only + timestamp).toLowerCase(); //
  // console.log(config);
  config.headers.timestamp = timestamp //时间戳
  config.headers.verificationStr = verificationStr //16位随机字符串
  config.headers.apiSign = sign_ordinary; //普通接口签名
  if (config.headers['Content-Type'] == 'application/json') {
    config.headers.parameterSign = ObjSort(config.params)
  } else {
    // 业务签名
    if (config.method == "post") {
      if (config.data instanceof FormData) {
        config.headers.parameterSign = ObjSort(config.data)
      } else {
        config.headers.parameterSign = ObjSort(qs.parse(config.data))
      }
    } else if (config.method == "get") {
      config.headers.parameterSign = ObjSort(config.params)
    }
  }
  return config
}
export default {
  configure
}
