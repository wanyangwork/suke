var gulp = require("gulp");
var cssnano  = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var bs = require("browser-sync").create();
var sass = require("gulp-sass")
var path = {
    'html':'./templates/**/',
    'css':'./src/css/**/',
    'js':'./src/js/',
    'images':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images/'
};

//定义一个 html任务
gulp.task("html",function () {
    gulp.src(path.html+"*.html")
        .pipe(bs.stream())
});

//定义一个css 任务

gulp.task("css",function () {
    gulp.src(path.css+"*.scss")
        .pipe(sass().on("error",sass.logError))
        .pipe(cssnano())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});


//定义一个js的任务
gulp.task("js",function () {
    gulp.src(path.js+"*.js")
        .pipe(uglify())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

//定义一个图片压缩任务
gulp.task("images",function () {
    gulp.src(path.images+"*.*")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});


//定义同一个监听文件修改的任务
gulp.task("watch",function () {
    gulp.watch(path.css + "*.scss",['css']);
    gulp.watch(path.js+"*.js" , ['js']);
    gulp.watch(path.images+"*.*" , ['images']);
    gulp.watch(path.html+"*.html", ['html']);
});


//浏览器自动刷新监控 主目录设置
gulp.task("bs",function () {
    bs.init({
        'server':{
            'baseDir':'./'
        }
    });
});


gulp.task("default",['bs','watch']);