import { Toast } from 'vant';

const timerObj: any = {};
let count = 0;

function showToast(obj?: any) {
  // const iconLoding = require('@/assets/img/icon-loading.gif');
  Toast.loading({
    message: (obj && obj.str) || '',
    forbidClick: true,
    duration: 0,
    overlay: (obj && obj.isOverlay) || false
    // icon: iconLoding
  });
}

/**
 * 全屏loading弹框
 */
function showLoading(obj?: any) {
  count++;
  showToast(obj);
  return 'loading-' + count;
}

function hideLoading(name?: any) {
  if (timerObj[name]) {
    clearTimeout(timerObj[name]);
    delete timerObj[name];
    Toast.clear();
    return;
  }
  Toast.clear();
}

function toastText(str: string, fn?: any) {
  Toast({
    type: 'html',
    message: str,
    className: 'notice-toast',
    onClose: function () {
      typeof fn === 'function' ? fn() : '';
    }
  });
}

export { showLoading, hideLoading, toastText };
