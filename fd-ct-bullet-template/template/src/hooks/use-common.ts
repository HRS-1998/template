import { getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/stores';
export default function useCommon(): any {
  const { appContext } = getCurrentInstance() as any;
  const proxy = appContext.config.globalProperties;
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const $dart = proxy.$dart;
  return { proxy, router, route, store, $dart };
}
