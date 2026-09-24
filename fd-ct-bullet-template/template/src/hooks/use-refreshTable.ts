// 支持带search 分页table 或者 独立分页table使用
// Bus.emit('ut-refresh', pageIndex);  使用次方法更新 table页码 pageIndex = 0 本页刷新
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Ref } from 'vue';
import Bus from '@/assets/js/bus';
import { merge, cloneDeep } from 'lodash-es';
// options
type TypeOptions = {
  ajax: any; //请求 promise 必填
  pagination: object | null; //分页数据 必填
  paginationMap: PaginationMap; //分页映射
  dataMap: DataMap; //数据映射
  code: number; //code 成功值
  searchRef: any; //searchRef 使用 必须带 search setLoading方法
  initData: boolean; //初始化数据
  searchData: any; //搜索项固定参数
  beforeFormat: any; //上传前参数格式化
  complete: any; //请求完成事件
  success: any; //请求成功事件
  bindEvent: string; //刷新事件名称
};

type DataMap = {
  data: string;
  code: string;
};

type PaginationMap = {
  pageSize: string;
  pageIndex: string;
};

// 返回值
type TypeReturnValues = {
  loading: Ref<boolean>;
  tableData: Ref<object>; // 获取列表接口 data
  onSearch: (searchValue: any) => void; // 搜索 Search 组件 search 事件
  onPageSizeChange: (size: number) => void; // 表格 Table 组件 page-change 事件
  onPageChange: (index: number) => void;
  searchDataHistory: any; // 搜索条件，用于导出参数
};

/**
 * @function useRefreshTable {首页 index.vue 中应用于搜索的逻辑整理}
 * @param  {typeParems}
 * @return {TypeReturnValues}
 *
 * 耦合点：1.刷新表格事件默认为 ut-refresh
 */
export default function useRefreshTable(params: any): TypeReturnValues {
  const config: TypeOptions = {
    ajax: null,
    searchRef: null,
    pagination: null,
    paginationMap: { pageSize: 'PageSize', pageIndex: 'PageIndex' },
    dataMap: {
      data: 'data',
      code: 'code'
    },
    code: 0,
    searchData: {},
    initData: true,
    beforeFormat: null,
    complete: null,
    success: null,
    bindEvent: 'ut-refresh'
  };
  const options = merge(config, params);
  const loading = ref(false);
  const tableData = ref<any>([]);
  const searchDataHistory = ref<any>({}); // 历史搜索条件
  const paginationDefault = options.pagination || {
    [options.paginationMap.pageIndex]: 1,
    [options.paginationMap.pageSize]: 10
  };
  const pagination: any = { ...paginationDefault };
  const onSearch = (searchValue: any) => {
    searchDataHistory.value = cloneDeep(searchValue);
    pagination[options.paginationMap.pageIndex] = 1;
    refreshTable(searchValue);
  };
  const setTableLoading = (type: boolean) => {
    loading.value = type;
  };
  const setSearchLoading = (type: boolean) => {
    if (!options.searchRef) {
      return;
    }
    options.searchRef.value?.setLoading(type);
  };
  //刷新表格数据
  const refreshTable = (data?: any) => {
    if (!options.ajax) {
      return;
    }
    setTableLoading(true);
    const dataMap = options.dataMap;
    const newData = data ? data : searchDataHistory.value;

    let prames = options.searchRef
      ? {
          ...newData,
          ...options.searchData,
          ...pagination
        }
      : {
          ...options.searchData,
          ...pagination
        };
    if (options.beforeFormat) {
      prames = options.beforeFormat(prames);
    }
    options
      .ajax(prames)
      .then((res: any) => {
        if (res[dataMap.code] !== options.code) {
          tableData.value = [];
          return;
        }
        tableData.value = res[dataMap.data];
        options.success && options.success(res);
      })
      .catch(() => {
        tableData.value = [];
      })
      .finally(() => {
        setTableLoading(false);
        setSearchLoading(false);
        options.complete && options.complete();
      });
  };

  const onPageSizeChange = (size: number) => {
    if (size > 0) {
      pagination[options.paginationMap.pageSize] = size;
    }

    refreshTable();
  };

  // 表格切换页面
  const onPageChange = (pageIndex: number) => {
    if (pageIndex > 0) {
      pagination[options.paginationMap.pageIndex] = pageIndex;
    }

    refreshTable();
  };
  // 初始化获取列表
  const initData = () => {
    if (options.initData) {
      onMounted(() => {
        if (!options.searchRef) {
          refreshTable(options.searchData);
          return;
        }
        nextTick(() => {
          options.searchRef.value?.search();
        });
      });
    }
  };

  // 添加/编辑 页触发表格刷新
  const bindBusEvent = () => {
    Bus.on(options.bindEvent, (index: number = 0) => {
      onPageChange(index);
    });
  };

  onBeforeUnmount(() => {
    Bus.off(options.bindEvent);
  });

  bindBusEvent();
  initData();
  return {
    searchDataHistory,
    loading,
    tableData,
    onSearch,
    onPageSizeChange,
    onPageChange
  };
}
