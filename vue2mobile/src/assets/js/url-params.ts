import { getParam } from '@/utils/index';
// 来自url
function paramsFromUrl() {
  const data: any = {
    gameId: '', // 游戏ID，该值为空值
    type: ''
  };

  for (const key in data) {
    data[key] = getParam(key) || '';
  }
  return data;
}

export { paramsFromUrl };
