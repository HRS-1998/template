import Interfaces from '../interfaces';
import { Http } from 'nat';
import type { TypeAjaxCllback, TypeCompleteFun } from '@/types/common.d';

// 获取状态列表（枚举值）
const cardStatusList = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.cardStatusList,
    complete
  });
};

// 售卖中面值列表（枚举值）
const cardSalePriceList = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.cardSalePriceList,
    complete
  });
};

// 分页查询：获取客户点卡列表
const cardPage = (params: any, abort: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.cardPage,
    data: params,
    abort,
    complete
  });
};

export { cardStatusList, cardSalePriceList, cardPage };
