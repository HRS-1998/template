import Interfaces from '../interfaces';
import { Http } from 'nat';
import type { TypeAjaxCllback, TypeCompleteFun } from '@/types/common.d';

const getMyTicketsRecord = (params: any, complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.getMyTicketsRecord,
    data: params,
    complete
  });
};

const getExpireNum = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.getExpireNum,
    complete
  });
};

const getLeftNum = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'get',
    url: Interfaces.getLeftNum,
    complete
  });
};

export { getMyTicketsRecord, getExpireNum, getLeftNum };
