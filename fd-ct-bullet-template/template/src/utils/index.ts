import { ElMessage } from 'element-plus';
import type { messageType } from 'element-plus';
import dayjs from 'dayjs';
import { isPlainObject, forEach, isNil } from 'lodash-es';

// 提示消息
export const showMessage = (msg: string, type?: messageType): void => {
  ElMessage({
    message: msg || 'error',
    type: type || 'error'
  });
};

// 返回时间戳
export const dayjsValueOf = (time: Date): any => {
  return dayjs(time).valueOf();
};

// 时间格式化
export const dayjsFormat = (time: Date, str: any = 'YYYY-MM-DD HH:mm:ss'): any => {
  return dayjs(time).format(str);
};

// 清除对象中的空字符串数据
export const clearEmptyData = (data: any): any => {
  const result: any = {};
  if (!isPlainObject(data)) {
    return data;
  }
  forEach(data, (value, key) => {
    if (value !== '') {
      result[key] = value;
    }
  });
  return result;
};

//http 错误拦截 可拦截 404 403等
export const interceptErrorPublic = (res: any) => {
  if (res.Message) {
    showMessage(res.Message);
    return;
  }
  if (res && res.response) {
    showMessage(res.response.data || res.response.statusText || res.response.status);
  }
};

//合并到老数据有的属性
export const mergeHasSource = (oldData: any, newData: any) => {
  const result: any = {};
  for (const key in oldData) {
    if (!isNil(newData[key])) {
      result[key] = newData[key];
    }
  }

  return Object.assign({}, oldData, result);
};

// 将对象转换为 URL 参数
export const objectToUrlParams = (obj: object) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      params.append(key, value);
    }
  }
  return params.toString();
};

// 终止 promise canth 后向下执行
export function to<T, U = any>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}
