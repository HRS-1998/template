<template>
  <el-select-v2
    v-model="gameCode"
    :options="options"
    filterable
    clearable
    :empty-values="['', 0, null, undefined]"
    @change="onChange"
  />
</template>
<script lang="ts" setup>
import type { TypeAGameItem } from '@/types/common';
import { apiGetEnumList } from '@/api/common';
import { ref } from 'vue';

const emit = defineEmits(['change']);
const gameCode = defineModel({ type: String });
const options = ref<TypeAGameItem[]>([]);
const gamelist = ref<TypeAGameItem[]>([]);
function getGameList() {
  apiGetEnumList().then((res: any) => {
    if (res.code === 0) {
      gamelist.value = res.data;
      options.value = res.data.map((item: TypeAGameItem) => {
        return {
          label: `${item.GameId} | ${item.GameCode} | ${item.GameName}`,
          value: item.GameCode
        };
      });
    }
  });
}
getGameList();
const onChange = (value: string) => {
  const item = gamelist.value.find((item: TypeAGameItem) => item.GameCode === value);
  emit('change', item?.GameId);
};
</script>
