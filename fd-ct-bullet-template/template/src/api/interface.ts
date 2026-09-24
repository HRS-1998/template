const getApi = (paths: any) => {
  const apiPre = 'test';
  const result: any = {};

  for (const key in paths) {
    result[key] = paths[key].replace('/api/', `/api/${apiPre}/`);
  }
  return result;
};

const common = {
  getPower: '/api/getPower',
  getEnumList: '/api/Common/getEnumList'
};
export const commonApi = getApi(common);
