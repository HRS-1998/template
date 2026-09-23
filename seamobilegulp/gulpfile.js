import gulp from 'gulp';
import uglify from 'gulp-uglify';
import minifycss from 'gulp-minify-css';
import replace from 'gulp-replace';
// import useref from 'gulp-useref';
import assetRev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import clean from 'gulp-clean';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'autoprefixer';
import requirejsOptimize from 'gulp-requirejs-optimize';
import config from './build-user/config.js';
import connect from 'gulp-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import preprocess from 'gulp-preprocess';
import babel from 'gulp-babel';
import portfinder from 'portfinder';
import postcss from 'gulp-postcss';
import pxtorem from 'postcss-pxtorem';
//获取环境
const NODE_ENV = process.env.NODE_ENV || 'development';
const envConfig = config.envConfig[NODE_ENV];
const BASE_URL =
    NODE_ENV === 'development' ? '' : envConfig.domainUrl + config.appUrl;
const modeConfig = {
    build: 'dest',
    serve: 'destServer',
    mode: ''
};
const processors = [
    pxtorem({
        rootValue: 100, // 根字体大小
        //unitPrecision: 5, // 转换后保留的小数位数
        propList: ['*'] // 需要转换的属性列表
        //selectorBlackList: [], // 忽略的选择器黑名单
        //replace: true, // 是否替换原始的 px 单位，默认为 true
        //mediaQuery: false, // 是否转换媒体查询中的 px，默认为 false
        //minPixelValue: 0 // 最小的 px 值，默认为 0
    }),
    autoprefixer({
        overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ie >= 8'
        ],
        cascade: false
    })
];
//sass 初始化
const sass = gulpSass(dartSass);
function sassCompile() {
    return gulp
        .src('src/assets/css/*.scss')
        .pipe(sass()) // 转成CSS
        .pipe(gulp.dest('src/assets/css'));
}
//环境变量替换
function replaceEnv() {
    const envData = JSON.parse(fs.readFileSync('.env.json'));
    const currentEnvData = JSON.parse(fs.readFileSync(`.env.${NODE_ENV}.json`));
    const Env = Object.assign(envData, currentEnvData, { NODE_ENV, BASE_URL });
    return gulp
        .src(`${modeConfig.mode}/**/*.{html,js,css}`)
        .pipe(preprocess({ context: { NODE_ENV: NODE_ENV } }))
        .pipe(replace('%BASE_URL%', BASE_URL))
        .pipe(
            replace(
                /process\.env\.(\w+)/g,
                function handleReplace(match, p1, offset, string) {
                    return Env[p1];
                }
            )
        )
        .pipe(gulp.dest(modeConfig.mode, { overwrite: true }));
}
function copyRequireBuild() {
    return gulp
        .src('dest/.build/assets/**', { allowEmpty: true })
        .pipe(clean())
        .pipe(gulp.dest('dest/assets'));
}
function requireBuild(cb) {
    if (!config.requirejs) {
        cb();
        return;
    }

    config.requirejs.forEach(function (item) {
        gulp.src('dest/' + item.Entry + item.Name)
            .pipe(
                requirejsOptimize({
                    optimize: 'none'
                })
            )
            .pipe(gulp.dest('dest/.build/' + item.Entry));

        gulp.src('dest/' + item.Entry, { read: false }).pipe(clean());
    });
    setTimeout(function () {
        cb();
    }, 2000);
}
function transformJs(cb) {
    return gulp
        .src('dest/assets/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dest/assets'));
}
function transformCss(cb) {
    return gulp
        .src('dest/assets/**/*.css')
        .pipe(postcss(processors))
        .pipe(
            minifycss({
                compatibility: 'ie7'
            })
        )
        .pipe(gulp.dest('dest/assets'));
}

function setHash() {
    return gulp
        .src(['dest/assets/**', '!dest/assets/libs/**'])
        .pipe(assetRev())
        .pipe(gulp.dest('dest/.build/assets'))
        .pipe(assetRev.manifest())
        .pipe(gulp.dest('dest/rev'));
}
function replaceHash() {
    return gulp
        .src(['dest/rev/rev-manifest.json', 'dest/.build/**/*.{html,css}'])
        .pipe(revCollector())
        .pipe(gulp.dest('dest/.build'));
}
function start(cb) {
    portfinder.basePort = config.devServer.port; // 设置起始端口
    portfinder.getPort(function (err, port) {
        if (err) {
            done(err);
            return;
        }
        connect.server(
            {
                /*根路径*/
                root: `./${modeConfig.serve}`,
                /*开启浏览器自动刷新*/
                livereload: true,
                host: '0.0.0.0', //ip可访问
                /*端口号*/
                port: port,
                /*使用代理服务*/
                middleware: function (connect, opt) {
                    var list = [];
                    for (var key in config.devServer.proxy) {
                        list.push(
                            createProxyMiddleware(
                                key,
                                config.devServer.proxy[key]
                            )
                        );
                    }

                    return list;
                }
            },
            function () {
                console.log(
                    '\x1B[32m%s\x1B[32m',
                    `Server started \n http://${config.devServer.host1}:${port} \n http://${config.devServer.host2}:${port}`
                );
            }
        );
    });

    cb();
}
function cleanDist() {
    return gulp.src('dist', { allowEmpty: true, read: false }).pipe(clean());
}
function cleanDest() {
    return gulp
        .src(modeConfig.mode, { allowEmpty: true, read: false })
        .pipe(clean());
}
function copysrc() {
    return gulp
        .src([
            'src/**',
            '!src/assets/sass/**',
            '!src/sprite/**',
            '!src/assets/**/*.scss'
        ])
        .pipe(gulp.dest(modeConfig.mode));
}
function copyPublic() {
    return gulp.src('public/**').pipe(gulp.dest(`${modeConfig.serve}/public`));
}

function replaceHtmlBaseUrl() {
    return gulp
        .src('dest/.build/**/*.html')
        .pipe(replace(/(=\s*)(['"]*)(\/*)public\//g, '$1$2'))
        .pipe(
            replace(
                /(=\s*)(['"]*)(\.*)(\/*)assets\//g,
                '$1$2' + BASE_URL + 'assets/'
            )
        )
        .pipe(gulp.dest('dest/.build'));
}
function connectReload() {
    return gulp.src(`${modeConfig.serve}/**/*.html`).pipe(connect.reload());
}
function cssRem() {
    return gulp
        .src(`${modeConfig.serve}/assets/**/*.css`)
        .pipe(postcss(processors)) // 使用px2rem插件进行转换
        .pipe(gulp.dest(`${modeConfig.serve}/assets`)); // 输出到dist目录
}
function watch(cb) {
    gulp.watch(['src/assets/**/*.scss'], gulp.series(sassCompile));
    gulp.watch(
        [
            'src/**',
            '!src/assets/**/*.scss',
            '!src/assets/sass/**',
            '!src/sprite/**'
        ],
        gulp.series(copysrc, replaceEnv, cssRem, connectReload)
    );
    gulp.watch(['public/**'], gulp.series(copyPublic, connectReload));
    cb();
}

function moveDestToDist() {
    return gulp
        .src(['dest/.build/**', '!dest/.build/assets/libs/**'])
        .pipe(gulp.dest('dist'));
}
function movePublicToDist() {
    return gulp.src('public/**').pipe(gulp.dest('dist'));
}
function moveFileToEnv() {
    const fileDir = envConfig.indexPath;
    return gulp
        .src('dist/**', { ignore: 'dist/assets/**' })
        .pipe(gulp.dest(`dist/${fileDir}/`));
}
function moveHtmlToBuild() {
    return gulp.src('dest/**/*.html').pipe(gulp.dest('dest/.build'));
}
function modeSetBuild(cb) {
    modeConfig.mode = modeConfig.build;
    cb();
}
function modeSetServe(cb) {
    modeConfig.mode = modeConfig.serve;
    cb();
}
const filterToFile = gulp.series(cleanDest, sassCompile, copysrc, replaceEnv);

const build = gulp.series(
    modeSetBuild,
    cleanDist,
    filterToFile,
    requireBuild,
    copyRequireBuild,
    transformJs,
    transformCss,
    setHash,
    moveHtmlToBuild,
    replaceHash,
    replaceHtmlBaseUrl,
    moveDestToDist,
    movePublicToDist,
    moveFileToEnv
);

export default build;

export const serve = gulp.series(
    modeSetServe,
    filterToFile,
    cssRem,
    copyPublic,
    watch,
    start
);
