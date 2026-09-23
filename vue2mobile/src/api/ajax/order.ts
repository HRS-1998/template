import Interfaces from '../interfaces';
import { Http } from 'nat';
import type { TypeAjaxCllback, TypeCompleteFun } from '@/types/common.d';

const createOrder = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'post',
    url: Interfaces.createOrder,
    complete
  });
};

const searchOrder = (complete?: TypeCompleteFun): TypeAjaxCllback => {
  return Http.ajax({
    method: 'post',
    url: Interfaces.searchOrder,
    complete
  });
};

export { createOrder, searchOrder };
