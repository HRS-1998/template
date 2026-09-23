import Interfaces from '../interfaces';
import { Http } from 'nat';
import type { TypeAjaxCllback, TypeCompleteFun } from '@/types/common.d';

const getGoodsList = (params: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'post',
    url: Interfaces.getGoodsList,
    data: params,
    complete
  });
};

const getGoodsInfo = (params: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.getGoodsInfo,
    data: params,
    complete
  });
};

const getPageOrder = (params: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.getPageOrder,
    data: params,
    complete
  });
};

const directExchange = (params: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'post',
    url: Interfaces.directExchange,
    data: params,
    complete
  });
};

export { getGoodsList, getGoodsInfo, getPageOrder, directExchange };
