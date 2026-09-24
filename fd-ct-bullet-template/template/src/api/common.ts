import { commonApi } from '@/api/interface';
import { Http } from 'ct-dart3';

//所属页面权限
export const apiGetPower = (params: { PageId: number }): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commonApi.getPower,
    data: params
  });
};

// 公共枚举示例
export const apiGetEnumList = (): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commonApi.getEnumList
  });
};
