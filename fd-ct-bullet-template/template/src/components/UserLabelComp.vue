<template>
  <el-radio-group v-model="tagType" @change="onTagTypeChange" :disabled="readonly">
    <el-radio :value="1">全部标签</el-radio>
    <el-radio :value="2" style="margin-right: 5px"> 同城游标签 </el-radio>
    <el-popover placement="top-start" width="310" trigger="hover">
      <div class="pop-content">
        <p style="font-size: 16px" class="mb20">标签:</p>
        <p>标签来源于业务后台【基础服务>>标签】,如需新增动态标签请与对应产品负责人联系。</p>
        <p style="margin-top: 20px">组合逻辑：</p>
        <el-row>
          <el-col :span="12" class="mb10">
            <div class="mb10">1.并集--A并集B</div>
            <img width="100" src="../assets/img/img1.png" alt="" />
          </el-col>
          <el-col :span="12" class="mb10">
            <div class="mb10">2.交集--A交集B</div>
            <img width="100" src="../assets/img/img2.png" alt="" />
          </el-col>
          <el-col :span="12" class="mb10">
            <div class="mb10">3.差集--A差集B</div>
            <img width="100" src="../assets/img/img3.png" alt="" />
          </el-col>
          <el-col :span="12" class="mb10">
            <div class="mb10">4.补集--A并集B的补集</div>
            <img width="100" src="../assets/img/img4.png" alt="" />
          </el-col>
        </el-row>
        <span>目前最多支持3个标签从上至下依次组合。</span>
      </div>
      <template #reference>
        <el-icon :size="14"><QuestionFilled /></el-icon>
      </template>
    </el-popover>
  </el-radio-group>
  <el-form ref="tagFormRef" :model="tagObj" class="tags-form" v-if="tagType !== 1">
    <div v-for="(tag, index) in tagObj.tagList" :key="index">
      <el-form-item
        :prop="'tagList.' + index + '.tagId'"
        :rules="[
          {
            required: true,
            message: '必填',
            trigger: 'change'
          }
        ]"
        class="mb15"
      >
        <el-row :gutter="10">
          <el-col :span="23">
            <el-select
              v-model="tag.tagId"
              placeholder="请输入标签ID或标签名称"
              clearable
              filterable
              :disabled="readonly"
            >
              <el-option
                v-for="item in store.tcyTagList"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="padding-top: 5px" v-if="!readonly">
            <el-icon size="16" style="cursor: pointer" @click="onDeleteTag(index)">
              <Delete />
            </el-icon>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :prop="'tagList.' + index + '.type'" style="width: 200px" class="mb15 tag-type">
        <el-select v-model="tag.type" :disabled="readonly">
          <el-option
            v-for="item in tagTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="flex-center">
      <el-button
        :icon="Plus"
        :disabled="tagObj.tagList.length >= limit"
        class="mr10"
        @click="onAddTag"
        v-if="!readonly"
      >
        添加组合标签
      </el-button>
      <el-checkbox v-model="tagObj.isComplement" label="补集" :disabled="readonly" />
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import useCommon from '@/hooks/use-common';

const { store } = useCommon();
withDefaults(defineProps<{ readonly: boolean; limit: number }>(), { readonly: false, limit: 2 });
const emits = defineEmits(['type-change', 'data-add']);
const tagType = defineModel<number>('type');
const tagObj = defineModel<any>('list');
const tagFormRef = ref();
const tagTypeList = [
  { label: '并集', value: 1 },
  { label: '交集', value: 2 },
  { label: '差集', value: 3 }
];

const onTagTypeChange = (value: number) => {
  tagObj.value = {
    tagList: [],
    isComplement: false
  };
  emits('type-change', value);
};

const onAddTag = () => {
  tagObj.value.tagList.push({
    tagId: '',
    type: 1
  });
  emits('data-add');
};

const onDeleteTag = (index: number) => {
  tagObj.value.tagList.splice(index, 1);
};

const validate = async () => {
  return await tagFormRef.value.validate();
};

defineExpose({
  validate
});
</script>

<style scoped lang="scss">
.pop-content {
  padding: 5px;
  background-color: #fff;
  z-index: 2;
  p {
    text-align: left;
    margin: 5px 0;
  }
}

.tags-form {
  padding: 10px;
  border: 1px solid #eee;
  :deep(.is-success .el-select__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
  }
  :deep(.tag-type .el-select__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
  }
}
</style>
