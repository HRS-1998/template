/* eslint-disable no-undef */
const handlebarsHelpers = require('../helpers');

module.exports = {
  description: '新建一个页面',
  prompts: [
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
    },
    {
      type: 'list',
      name: 'comType',
      message: '请选择子页打开方式',
      choices: [
        {
          name: 'Drawer',
          value: 'Drawer'
        },
        {
          name: 'Dialog',
          value: 'Dialog'
        }
      ],
      when: function (answers) {
        return (
          answers.tool.includes('add') ||
          answers.table.includes('view') ||
          answers.table.includes('edit')
        );
      }
    },
    {
      type: 'input',
      name: 'pageName',
      message: '页面标题:',
      validate(name) {
        if (!name) {
          return '请输入页面标题';
        }
        return true;
      }
    }
  ],
  actions: (data) => {
    const name = '{{camelCase name}}';
    let _arr = [];
    let actions = [
      {
        type: 'append',
        path: `src/api/interface.ts`,
        templateFile: 'plop-templates/main/api/interface.hbs'
      },
      {
        type: 'add',
        path: `src/api/${name}.ts`,
        templateFile: 'plop-templates/main/api/index.hbs'
      },
      {
        type: 'append',
        pattern: /export\s*const\s*config:\s*any\s*=\s*(.*)/,
        path: `src/config/permission.ts`,
        templateFile: 'plop-templates/main/config/index.hbs'
      },
      {
        type: 'add',
        path: `src/types/${name}.d.ts`,
        templateFile: 'plop-templates/main/types/index.hbs'
      },
      {
        type: 'add',
        path: `src/views/${name}/components/Table.vue`,
        templateFile: 'plop-templates/main/components/Table.hbs'
      },
      {
        type: 'add',
        path: `src/views/${name}/index.vue`,
        templateFile: 'plop-templates/main/index.hbs'
      },
      {
        type: 'append',
        pattern: /const\s*routes:\s*Array<RouteRecordRaw>\s*=\s*(.*)/,
        path: 'src/router/index.ts',
        templateFile: 'plop-templates/main/router/index.hbs'
      }
    ];

    const searchItem = {
      type: 'add',
      path: `src/views/${name}/components/Search.vue`,
      templateFile: 'plop-templates/main/components/Search.hbs'
    };
    const toolItem = {
      type: 'add',
      path: `src/views/${name}/components/Tool.vue`,
      templateFile: 'plop-templates/main/components/Tool.hbs'
    };
    const addItem = {
      type: 'add',
      path: `src/views/${name}/components/Add.vue`,
      templateFile: `plop-templates/main/components/Add${data.comType}.hbs`
    };
    const viewItem = {
      type: 'add',
      path: `src/views/${name}/components/View.vue`,
      templateFile: `plop-templates/main/components/View${data.comType}.hbs`
    };

    if (data.search !== 'noSearch') {
      _arr = [searchItem];
    }
    if (data.tool.length) {
      if (data.tool.includes('add')) {
        _arr = [toolItem, addItem, ..._arr];
      } else {
        _arr = [toolItem, ..._arr];
      }
    }
    if (data.table.includes('edit') && !data.tool.includes('add')) {
      _arr = [addItem, ..._arr];
    }
    if (data.table.includes('view')) {
      _arr = [viewItem, ..._arr];
    }

    return [..._arr, ...actions];
  }
};

// 调用辅助函数
const Handlebars = require('handlebars');
handlebarsHelpers(Handlebars);
