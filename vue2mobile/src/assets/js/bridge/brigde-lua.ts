/**
 * 文档说明（与引擎交互的文档）：http://doc.uc108.org:8002/web/#/626?page_id=12279
 */

const bridgeLua = (method: string, params: any) => {
  let proto = 'lua://' + method;

  if (null != params) {
    proto += '?' + encodeURI(params);
  }

  window.location.href = proto;
};

export { bridgeLua };
