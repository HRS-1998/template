/**
 * code码说明：填写url地址
 */

export const CODE = {
  SUCCESS: 0,
  ERROR: 10000,
  ACTIVITY_ERROR: 30000,
  GIFT_NOT_ENOUGH: 13301
};

export const CODE_TEXT = {
  [CODE.ERROR]: '系统错误',
  [CODE.ACTIVITY_ERROR]: '活动不存在',
  [CODE.GIFT_NOT_ENOUGH]: '礼券不足'
};
