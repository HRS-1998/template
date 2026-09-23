/* eslint-disable no-undef */
const { src, dest } = require('gulp');
const buildConfig = require('./build-user/config');
function move() {
  const envName = process.argv.slice(-1).join();
  const fileDir = buildConfig.envConfig[envName].indexPath;
  //console.log(fileDir);
  // place code for your default task here
  return src('dist/**', { ignore: 'dist/assets/**' }).pipe(dest(`dist/${fileDir}/`));
}

exports.move = move;
