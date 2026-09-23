const exchangemall = process.env.VUE_APP_API_URL_EXCHANGEMALL;
const gameshopsvc = process.env.VUE_APP_API_URL_GAMESHOPSVC;
const apppay = process.env.VUE_APP_API_URL_APPPAY;

const interfaces = {
  /**
   * @domain exchangemall.tcy365.com
   */
  getMyTicketsRecord: `${exchangemall}/api/UserTickets/GetMyTicketsRecord`, // 我的兑换券记录
  getExpireNum: `${exchangemall}/api/UserTickets/GetExpireNum`, // 查询指定日期用户会过期兑换券数量
  getLeftNum: `${exchangemall}/api/UserTickets/GetLeftNum`, // 我的兑换券数量
  cardStatusList: `${exchangemall}/api/card/statusList`, // 获取状态列表（枚举值）
  cardSalePriceList: `${exchangemall}/api/card/salePriceList`, // 售卖中面值列表（枚举值）
  cardPage: `${exchangemall}/api/card/page`, // 分页查询

  /**
   * @domain gameshopsvc.tcy365.net
   */
  getGoodsList: `${gameshopsvc}/api/Goods/GetGoodsList`, // 获取商品列表
  getGoodsInfo: `${gameshopsvc}/api/Goods/GetGoodsInfo`, // 获取商品接口：详情信息
  getPageOrder: `${gameshopsvc}/api/Goods/GetPageOrder`, // 获取用户分页订单信息
  directExchange: `${gameshopsvc}/api/Goods/DirectExchange`, // 直接兑换接口（非人民币商品）

  /**
   * @domain apppay.tcy365.com
   */
  createOrder: `${apppay}/api/order/createtrade`, // 创建订单
  searchOrder: `${apppay}/api/order/getorderstatus` // 查询订单
};

export default {
  ...interfaces
};
