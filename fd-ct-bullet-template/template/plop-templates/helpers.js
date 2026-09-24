/* eslint-disable no-undef */
module.exports = function (Handlebars) {
  // 相等
  Handlebars.registerHelper('isEqual', function (value, target) {
    return value === target;
  });
  // 不相等
  Handlebars.registerHelper('isInequality', function (value, target) {
    return value !== target;
  });
  // 包含
  Handlebars.registerHelper('isIncludes', function (value, target) {
    return value.includes(target);
  });
  // 不包含
  Handlebars.registerHelper('isNoIncludes', function (value, target) {
    return !value.includes(target);
  });
  // 逻辑或
  Handlebars.registerHelper('isOr', function (value1, value2) {
    return value1 || value2;
  });
  // 逻辑且
  Handlebars.registerHelper('isAnd', function (value1, value2) {
    return value1 && value2;
  });
  // 全部转大写
  Handlebars.registerHelper('upperCaseCustom', function (value) {
    return value.replaceAll('-', '').toUpperCase();
  });
  // 数组非空
  Handlebars.registerHelper('isArrayNoEmpty', function (value) {
    return Array.isArray(value) && value.length;
  });
  // 布尔判断
  Handlebars.registerHelper('isBoole', function (value) {
    return !!value;
  });
};
