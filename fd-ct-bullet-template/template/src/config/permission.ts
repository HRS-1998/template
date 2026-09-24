export const config: any = {
  home: {
    pageId: 23021103,
    title: '主页',
    view: 23340105,
    data: {
      edit: 23340106
    }
  }
};

export const isView = (pageid: number, list: Array<number>) => {
  if (!pageid || !list) {
    return false;
  }
  for (const key in config) {
    const item = config[key];
    if (item.pageId === pageid) {
      return list.indexOf(item.view) >= 0;
    }
  }
  return false;
};

export const alias = () => {
  let result = {};
  for (const key in config) {
    result = { ...result, ...config[key].data };
  }
  return result;
};
