<template>
  <el-popconfirm
    placement="bottom-end"
    width="180"
    v-bind="$attrs"
    :title="`确定${name}吗`"
    @confirm="handleApi"
  >
    <template #reference>
      <el-button :type="type" :link="link" :icon="btnIcon" :loading="loading" v-if="!hasAASlot">
        {{ name }}
      </el-button>
      <slot name="custom" :loading="loading"></slot>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { ref, useSlots, computed } from 'vue';
import { showMessage, to } from '@/utils/index';
import Bus from '@/assets/js/bus';

const props = withDefaults(
  defineProps<{
    type?: string;
    link?: boolean;
    btnIcon?: any; // icon 图标
    bindEvents?: string; // 弹窗提示语
    dataMap?: { data: string; code: string };
    code?: number | boolean; // 接口返回 code
    message?: string; // 操作成功提示消息
    name: string; // 按钮名
    params: { [key: string]: any };
    ajax: (params: any) => Promise<any>;
    success?: () => any; // 成功回调
  }>(),
  {
    type: 'primary',
    link: true,
    bindEvents: 'ut-refresh',
    code: 0,
    dataMap: () => {
      return { data: 'data', code: 'code' };
    }
  }
);

const hasAASlot = computed(() => {
  const slots = useSlots();

  return !!slots.custom;
});

const loading = ref(false);

const handleApi = async () => {
  loading.value = true;
  const [err, res] = await to(props.ajax({ ...props.params })).finally(() => {
    loading.value = false;
  });

  if (err) return;
  if (res[props.dataMap.code] !== props.code) return;
  const msg = props.message ? props.message : `${props.name}成功！`;

  showMessage(msg, 'success');
  Bus.emit(props.bindEvents);
  props.success && props.success();
};
</script>

<style lang="scss">
.el-popconfirm__main {
  margin: 0 !important;
}
</style>
