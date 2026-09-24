import { isString } from 'lodash-es';
import { apiGetPower } from '@/api/common';
import { showMessage } from '@/utils';
import router from '@/router';
import { isView } from '@/config/permission';
let PermissionPageId = 0;

export const routerInit = (Permission: any) => {
  router.beforeEach(async (to) => {
    const config: any = to.meta.config;
    const pageId = Number(config.pageId);

    if (isString(config.title)) {
      document.title = config.title;
    }
    if (pageId && PermissionPageId !== pageId) {
      await apiGetPower({ PageId: config.pageId })
        .then((res: any) => {
          const data: any = JSON.parse(JSON.stringify(res).toLowerCase());

          if (data.code === 0) {
            Permission.success(data.data);
            PermissionPageId = pageId;
            if (!isView(pageId, data.data)) {
              Permission.go403();
            }
            return true;
          }
          Permission.go403();
          return false;
        })
        .catch(function () {
          showMessage('权限获取错误');
          return false;
        });
      return true;
    }
    return true;
  });
};
