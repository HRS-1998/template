<template>
  <el-radio-group v-model="channelType" @change="onChannelTypeChange" :disabled="readonly">
    <el-radio :value="1">全部渠道</el-radio>
    <el-radio :value="2">定向渠道</el-radio>
    <el-radio :value="3">屏蔽渠道</el-radio>
  </el-radio-group>
  <div v-if="channelType !== 1 && !readonly">
    <div class="flex-center">
      <UplaodFile
        accept=".csv"
        name="导入csv渠道表格"
        :action="ajax"
        :show-file-list="false"
        :onSuccess="onUploadSuccess"
      />
      <span class="ml10">
        (导入会覆盖已输入的内容，点击此处下载
        <span @click="onDownloadTem" class="primary">渠道导入模板) </span>
      </span>
    </div>
    <dart-input
      v-model="channelIdList"
      input-type="regexp"
      clearable
      type="textarea"
      trim
      placeholder="请输入或导入渠道ID，多个渠道用英文逗号隔开"
      class="mt5"
      :regexp="/[^0-9,]/g"
      :autosize="{ minRows: 4 }"
    />
  </div>
  <dart-textarea-content :value="channelIdList" v-if="readonly" />
</template>

<script lang="ts" setup>
import UplaodFile from './UplaodFile.vue';
import { showMessage } from '@/utils';

withDefaults(defineProps<{ readonly: boolean; ajax: any }>(), { readonly: false });
const emits = defineEmits(['change']);
const channelType = defineModel<number>('type');
const channelIdList = defineModel<string>('list');

const onChannelTypeChange = (value: number) => {
  channelIdList.value = '';
  emits('change', value);
};

const onUploadSuccess = (res: any) => {
  const { code, data } = res;

  if (code) return false;

  showMessage('上传成功', 'success');
  channelIdList.value = data;
  return true;
};

const onDownloadTem = () => {
  window.open('/channel_template.csv');
};
</script>
