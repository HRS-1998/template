export type ResponseInfo = {
  code: number;
  data: any;
  message: string;
};

export type TypeAjaxCllback = Promise<any>;

type TypeAnyObject = {
  [propName: string]: any;
};

type TypeAGameItem = {
  GameId: number;
  GameName: string;
  GameCode: string;
};
