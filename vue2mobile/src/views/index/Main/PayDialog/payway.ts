import { isiOS } from '@/utils';

const payway = {
  zfb: {
    h5: 'alipayweb',
    notH5: 'alipay',
    h5Ver: '2.0',
    notH5Ver: '1.1'
  },
  wx: {
    h5: 'weixinweb',
    notH5: 'weixin',
    h5Ver: '',
    notH5Ver: ''
  }
};
let paywayObj: any = {};
let pagename: string = '';
let issdkpay: boolean = false;
let isIos: boolean = false;

// 有ios端，有adr端：ios端为h5支付，adr端为引擎支付
function play2PayWay() {
  return {
    PayWayAlias: isIos ? paywayObj.h5 : paywayObj.notH5,
    PayWayVersionNo: isIos ? paywayObj.h5Ver : paywayObj.notH5Ver
  };
}

// 无ios端，只有adr端：是否支持sdk支付，不支持则为h5支付
function playonsdkPayWay() {
  return {
    PayWayAlias: !issdkpay ? paywayObj.h5 : paywayObj.notH5,
    PayWayVersionNo: !issdkpay ? paywayObj.h5Ver : paywayObj.notH5Ver
  };
}

// h5网页支付
function playontpPayWay() {
  return {
    PayWayAlias: paywayObj.h5,
    PayWayVersionNo: paywayObj.h5Ver
  };
}

function initData(vm: any, type: any) {
  paywayObj = type === 'zfb' ? payway.zfb : payway.wx;
  pagename = '';
  issdkpay = true; // 需要判断是否是sdk支付
  isIos = isiOS();
}

function getPayWay(vm: any, type: any) {
  initData(vm, type);
  const obj: any = {
    play2: play2PayWay(), // play2投放到同城游：只有安卓平台、苹果企业包，无安卓合集包
    playonsdk: playonsdkPayWay(), // playonsdk投放到同城游：只有安卓平台、安卓合集包，无苹果企业包
    playontp: playontpPayWay() // playontp投放到108社区或者第三方：只有安卓平台、苹果企业包
  };
  return obj[pagename];
}

function target(resData: any) {
  return { TargetUrl: resData.PayExtInfo.res_client_forward_url };
}

function payInfo(resData: any) {
  const { OrderInfo, OrderInfoSign } = resData;
  return {
    PayInfo: {
      OrderInfo,
      OrderInfoSign
    }
  };
}

function play2PayResult(resData: any) {
  if (isIos) {
    return target(resData);
  }
  return payInfo(resData);
}

function playonsdkPayResult(resData: any) {
  if (!issdkpay) {
    return target(resData);
  }
  return payInfo(resData);
}

function playontpPayResult(resData: any) {
  return target(resData);
}

function dealResData(resData: any) {
  const obj: any = {
    play2: play2PayResult(resData), // play2投放到同城游：只有安卓平台、苹果企业包，无安卓合集包
    playonsdk: playonsdkPayResult(resData), // playonsdk投放到同城游：只有安卓平台、安卓合集包，无苹果企业包
    playontp: playontpPayResult(resData) // playontp投放到108社区或者第三方：只有安卓平台、苹果企业包
  };
  return obj[pagename];
}

export { getPayWay, dealResData };
