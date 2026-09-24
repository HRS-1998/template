<template>
  <el-upload
    ref="uploadRef"
    :file-list="fileList"
    :limit="1"
    :accept="accept"
    :on-exceed="onExceed"
    :on-success="onSuccessFun"
    :on-remove="onRemove"
    :on-progress="onProgress"
    :before-upload="beforeUpload"
    :on-error="onError"
    v-bind="$attrs"
    class="upload-file"
  >
    <template #trigger>
      <el-button :type="type" :link="link">{{ name }}</el-button>
    </template>
    <template #file="{ file }">
      <div class="flex-center" style="width: 100%">
        <el-button link :loading="loading" @click="onClickFile()">
          <el-icon class="mr5"><Document /></el-icon>
          <span>{{ file?.name || '' }}</span>
        </el-button>
        <span class="ml20" v-if="_fileSize">{{ _fileSize }}</span>
        <el-icon class="green ml20"><SuccessFilled /></el-icon>
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { showMessage } from '@/utils';

const props = withDefaults(
  defineProps<{
    name?: string;
    link?: boolean;
    type?: string;
    size?: number; //  KB 数
    maxSize?: number; // 最大 KB 数
    accept?: string;
    onSuccess?: Function;
    beforeUpload?: Function;
  }>(),
  {
    name: '选择文件',
    link: false,
    type: '',
    accept: '.zip,.txt,.csv,.xlsx',
    maxSize: 100 * 1024 * 1024
  }
);

const fileData = defineModel<string>();
const uploadRef = ref();
const fileList = ref<any[]>([]);
const loading = ref(false);
const fileSize = ref(0);

const _fileSize = computed(() => {
  const _size = props.size || fileSize.value;

  return _size > 1024 ? `${_size / 1024}M` : `${_size}KB`;
});

watch(
  () => fileData.value,
  (newVal: any) => {
    if (!newVal) return;
    fileList.value.push({ name: newVal.split('/').at(-1) || '', url: newVal });
  },
  {
    immediate: true
  }
);

const onExceed = (files: any) => {
  uploadRef.value!.clearFiles();

  const file = files[0];
  uploadRef.value!.handleStart(file);
  uploadRef.value!.submit();
};

const beforeUpload = async (file: File) => {
  const type = file.name.split('.').at(-1);

  setLoading(false);
  if (props.beforeUpload && !(await props.beforeUpload(file))) {
    return false;
  }
  if (!props.accept.includes(type!)) {
    showMessage(`上传文件只支持上传 ${props.accept} 格式`);
    fileData.value = '';
    return false;
  }
  if (file.size / 1024 > props.maxSize) {
    if (props.maxSize >= 1024) {
      showMessage(`上传文件大小不能超过${props.maxSize / 1024}MB`);
    } else {
      showMessage(`上传文件大小不能超过${props.maxSize}KB`);
    }
    fileData.value = '';
    return false;
  }

  fileSize.value = file.size / 1024;
  return true;
};

const onSuccessFun = (res: any) => {
  const { code, data, message } = res;

  setLoading(false);
  if ((props.onSuccess && !props.onSuccess(res)) || code) {
    showMessage(message);
    onRemove();
    return;
  }

  if (props.onSuccess) return;
  fileData.value = data;
};

const onRemove = () => {
  setLoading(false);
  fileData.value = '';
  uploadRef.value!.clearFiles();
};

const onProgress = () => {
  setLoading(true);
};

const onError = () => {
  setLoading(false);
};

const setLoading = (bool: boolean) => {
  loading.value = bool;
};

const onClickFile = () => {
  window.open(fileData.value);
};
</script>

<style lang="scss">
.upload-file {
  .el-upload-list__item {
    transition: none;
  }
}
</style>
