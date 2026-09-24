/* eslint-disable no-undef */
const handlebarsHelpers = require('../helpers');

module.exports = {
  description: '新建一个子页面',
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
      name: 'name',
      message: '页面路由名称:',
      validate(name) {
        if (!name) {
          return '请输入页面路由名称';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'search',
      message: '请选择 Search 组件配置',
      choices: [
        {
          name: '无搜索',
          value: 'noSearch'
        },
        {
          name: '少量搜索（<= 2）',
          value: 'lessSearch'
        },
        {
          name: '多搜索（> 2）',
          value: 'moreSearch'
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'tool',
      message: '请选择 Tool 组件配置',
      choices: [
        {
          name: '新增',
          value: 'add'
        },
        {
          name: '导出',
          value: 'export'
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'table',
      message: '请选择 Table 组件配置',
      choices: [
        {
          name: '编辑',
          value: 'edit'
        },
        {
          name: '查看',
          value: 'view'
        },
        {
          name: '删除',
          value: 'delete'
        },
        {
          name: '禁/启用',
          value: 'enable'
        }
      ]
    }
  ],
  actions: (data) => {
    const name = '{{camelCase name}}';
    const mainName = '{{camelCase mainName}}';
    let _arr = [];

    let actions = [
      {
        type: 'append',
        pattern: new RegExp(`const\\s*${data.mainName}\\s*=\\s*\\{`),
        path: `src/api/interface.ts`,
        templateFile: 'plop-templates/child/api/interface.hbs'
      },
      {
        type: 'append',
        path: `src/api/${mainName}.ts`,
        templateFile: 'plop-templates/child/api/index.hbs'
      },
      {
        type: 'append',
        path: `src/types/${mainName}.d.ts`,
        templateFile: 'plop-templates/child/types/index.hbs'
      },
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/components/Table.vue`,
        templateFile: 'plop-templates/child/components/Table.hbs'
      },
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/index.vue`,
        templateFile: 'plop-templates/child/index.hbs'
      },
      {
        type: 'append',
        pattern: new RegExp(
          `meta:\\s*\\{\\s*config:\\s*config\\.${data.mainName}\\s*\\},\\s*children:\\s*\\[`
        ),
        path: 'src/router/index.ts',
        templateFile: 'plop-templates/child/router/index.hbs'
      }
    ];

    const searchItem = [
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/components/Search.vue`,
        templateFile: 'plop-templates/child/components/Search.hbs'
      }
    ];
    const toolItem = [
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/components/Tool.vue`,
        templateFile: 'plop-templates/child/components/Tool.hbs'
      }
    ];
    const addItem = [
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/components/Add.vue`,
        templateFile: 'plop-templates/child/components/Add.hbs'
      }
    ];
    const viewItem = [
      {
        type: 'add',
        path: `src/views/${mainName}/${name}/components/View.vue`,
        templateFile: 'plop-templates/child/components/View.hbs'
      }
    ];

    if (data.table.includes('edit')) {
      _arr = [...addItem];
    }
    if (data.table.includes('view')) {
      _arr = [...viewItem, ..._arr];
    }
    if (data.tool.length) {
      if (!data.table.includes('edit') && data.tool.includes('add')) {
        _arr = [...toolItem, ...addItem, ..._arr];
      } else {
        _arr = [...toolItem, ..._arr];
      }
    }
    if (data.search !== 'noSearch') {
      _arr = [...searchItem, ..._arr];
    }

    return [..._arr, ...actions];
  }
};

// 调用辅助函数
const Handlebars = require('handlebars');
handlebarsHelpers(Handlebars);
