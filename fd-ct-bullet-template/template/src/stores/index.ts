import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiGetEnumList } from '@/api/common';
import type { ResponseInfo } from '@/types/common';

export const useStore = defineStore('index', () => {
  const enumList = ref([]);

  // 获取订单状态
  const getEnumList = async () => {
    const { code, data }: ResponseInfo = await apiGetEnumList();

    if (code) return;
    enumList.value = data;
  };

  return { enumList, getEnumList };
});
