/* eslint-disable no-undef */
const handlebarsHelpers = require('../helpers');

module.exports = {
  description: '新建一个模态框',
  prompts: [
    {
      type: 'input',
      name: 'mainName',
      message: '主页文件夹名称:',
      validate(name) {
        if (!name) {
          return '请输入主页文件夹名称';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'childName',
      message: '子页文件夹名称:'
    },
    {
      type: 'list',
      name: 'modalType',
      message: '请选择 modal 类型',
      choices: [
        {
          name: 'dialog',
          value: 'dialog'
        },
        {
          name: 'drawer',
          value: 'drawer'
        }
      ]
    },
    {
      type: 'input',
      name: 'name',
      message: 'modal 组件名称:',
      validate(name) {
        if (!name) {
          return '请输入 modal 组件名称';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'title',
      message: 'modal 组件标题:',
      validate(name) {
        if (!name) {
          return '请输入 modal 组件标题';
        }
        return true;
      }
    }
  ],
  actions: (data) => {
    const name = '{{properCase name}}';

    console.log(data);

    let actions = [
      {
        type: 'append',
        pattern: new RegExp(`const\\s*${data.mainName}\\s*=\\s*\\{`),
        path: `src/api/interface.ts`,
        templateFile: 'plop-templates/modal/api/interface.hbs'
      },
      {
        type: 'append',
        path: `src/api/${data.mainName}.ts`,
        templateFile: 'plop-templates/modal/api/index.hbs'
      },
      {
        type: 'append',
        path: `src/types/${data.mainName}.d.ts`,
        templateFile: 'plop-templates/modal/types/index.hbs'
      }
    ];

    const action1 = [
      {
        type: 'add',
        path: `src/views/${data.mainName}/components/${name}.vue`,
        templateFile: `plop-templates/modal/${data.modalType}/index.hbs`
      }
    ];

    const action2 = [
      {
        type: 'add',
        path: `src/views/${data.mainName}/${data.childName}/components/${name}.vue`,
        templateFile: `plop-templates/modal/${data.modalType}/index.hbs`
      }
    ];

    const action3 = [
      {
        type: 'append',
        pattern: new RegExp(
          `meta:\\s*\\{\\s*config:\\s*config\\.${data.mainName}\\s*\\},\\s*children:\\s*\\[`
        ),
        path: 'src/router/index.ts',
        templateFile: 'plop-templates/modal/router/index.hbs'
      }
    ];

    const action4 = [
      {
        type: 'append',
        pattern: new RegExp(
          `name:\\s*'${data.mainName + data.childName.charAt(0).toUpperCase() + data.childName.slice(1)}',`
        ),
        path: 'src/router/index.ts',
        templateFile: 'plop-templates/modal/router/index1.hbs'
      }
    ];

    if (!data.childName) {
      if (data.modalType === 'drawer') {
        return [...actions, ...action1, ...action3];
      }
      return [...actions, ...action1];
    } else {
      if (data.modalType === 'drawer') {
        return [...actions, ...action2, ...action4];
      }
      return [...actions, ...action2];
    }
  }
};

// 调用辅助函数
const Handlebars = require('handlebars');
handlebarsHelpers(Handlebars);
