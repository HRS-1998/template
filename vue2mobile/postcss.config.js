const AutoPrefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const buildConfig = require('./build-user/config');
module.exports = ({ file }) => {
  let remUnit;
  if (file && file.indexOf('vant') > -1) {
    remUnit = 50;
  } else {
    remUnit = 100;
  }
  const result = Object.assign(buildConfig.px2rem, {
    rootValue: remUnit
  });
  return {
    plugins: [
      AutoPrefixer({
        overrideBrowserslist: ['iOS >= 9', 'Android >= 5.0']
      }),
      pxtorem(result)
    ]
  };
};
