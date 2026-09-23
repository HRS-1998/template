<template>
  <button :class="['base-btn', classname]" @click="onClick">
    <span>{{ name }}</span>
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class BaseBtn extends Vue {
  @Prop() classname!: string;
  @Prop() name!: string;

  @Emit()
  onClick() {}
}
</script>

<style lang="scss">
.base-btn {
  width: 100%;
  height: 108px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: none;
  @include fc(36px, #ffffff);
  font-weight: 700;
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  &--normal {
    background: $ft-green-1;
  }
  &--primary {
    height: 88px;
    background: #fff;
    border: 2px solid $ft-green-1;
    border-radius: 5px;
    @include fc(36px, $ft-green-1);
  }
}
</style>
