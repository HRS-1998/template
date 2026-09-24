/* eslint-disable no-undef */
const mainGenerator = require('./plop-templates/main/prompt');
const childGenerator = require('./plop-templates/child/prompt');
const modalGenerator = require('./plop-templates/modal/prompt');

module.exports = (plop) => {
  plop.setGenerator('main', mainGenerator);
  plop.setGenerator('child', childGenerator);
  plop.setGenerator('modal', modalGenerator);
};
