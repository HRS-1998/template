<template>
  <div>
    <home-header />
    <home-center />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeHeader from './HomeHeader.vue';
import HomeCenter from './HomeCenter.vue';

@Component({
  components: {
    HomeHeader,
    HomeCenter
  }
})
export default class Home extends Vue {
  mounted() {}
}
</script>
