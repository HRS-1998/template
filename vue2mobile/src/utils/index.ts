/* eslint-disable */

var toString = Object.prototype.toString;

function isArray(val: any) {
  return toString.call(val) === '[object Array]';
}

function isUndefined(val: any) {
  return typeof val === 'undefined';
}

function isString(val: any) {
  return typeof val === 'string';
}

function isNumber(val: any) {
  return typeof val === 'number';
}

function isObject(val: any) {
  return val !== null && typeof val === 'object';
}

function isDate(val: any) {
  return toString.call(val) === '[object Date]';
}

function isFile(val: any) {
  return toString.call(val) === '[object File]';
}

function isFunction(val: any) {
  return toString.call(val) === '[object Function]';
}

function trim(str: any) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function isWeixinBrowser() {
  var ua: any = window.navigator.userAgent.toLowerCase();

  // eslint-disable-next-line
  return ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false;
}

function isAndroid() {
  return /(Android)/i.test(navigator.userAgent) ? true : false;
}

function isiOS() {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? true : false;
}

function getIosVer() {
  if (isiOS()) {
    var ver: any = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = parseInt(ver[1], 10);
    return version;
  }
  return 0;
}

function delCookie(name: any) {
  var exp = new Date();
  var cval = getCookie(name);

  exp.setTime(exp.getTime() - 1);
  if (cval != null)
    document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString();
}

function clearAllCookie() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    delCookie(name);
  }
}

function getCookie(key: any) {
  var arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));

  if (arr != null) {
    return decodeURIComponent(arr[2]);
  }
  return '';
}

function setCookie(key: any, value: any, domain: any) {
  var d = new Date();

  d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 7);
  document.cookie =
    key +
    '=' +
    encodeURI(value) +
    '; expires=' +
    d.toUTCString() +
    ';path=/' +
    ';domain=' +
    domain; // 给主域和根路径写cookie
}

// 获取网址中参数的参数值；
function getParam(name: any, src?: any) {
  const re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
  const m = re.exec(src || location.href);

  return m ? decodeURIComponent(m[1]) : '';
}

// 参数设置
function setParam(name: any, str: any, src: any) {
  const re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
  const m = re.exec(src);

  src = src || location.href;
  if (m !== null) {
    return src.replace(m[0], m[0].replace(name + '=' + m[1], name + '=' + str));
  }
  if (src.indexOf('?') !== -1) {
    return src + '&' + name + '=' + str;
  }
  return src + '?' + name + '=' + str;
}

// 参数删除
function removeParam(name: any, src: any) {
  let _src = src || location.href;

  _src = _src.replace(new RegExp('[?&]' + name + '=[^&#]*(#.*)?$'), '$1');
  _src = _src.replace(new RegExp('([?&])' + name + '=[^&]*&'), '$1');

  return _src;
}

export {
  isArray,
  isString,
  isNumber,
  isObject,
  isUndefined,
  isDate,
  isFile,
  isFunction,
  trim,
  isWeixinBrowser,
  isAndroid,
  isiOS,
  getIosVer,
  delCookie,
  clearAllCookie,
  getCookie,
  setCookie,
  getParam,
  setParam,
  removeParam
};
