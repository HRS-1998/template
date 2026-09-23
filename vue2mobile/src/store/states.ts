/**
 * 类型的定义，在明确类型的时候将变量定义为明确类型，如果不能明确则定义any类型，除非必要，
 * 否则项目中还是尽量少定义any类型
 */

interface IErrorPop {
  isShow: boolean;
  text: string;
}

interface IStates {
  cacheGoodsDetail: any;
  errorPop: IErrorPop;
}

const states: IStates = {
  cacheGoodsDetail: null,
  // 异常弹窗
  errorPop: {
    isShow: false,
    text: ''
  }
};

export default states;
