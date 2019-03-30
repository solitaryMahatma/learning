//获取gulp核心
var gulp = require('gulp');
//获取pipe代替组件
var pump = require('pump')
//编译sass文件，获取gulp-sass组件,安装 cnpm i gulp-sass -s -d
var sass = require('gulp-sass');
//获取css压缩组件，安装 cnpm i gulp-clean-css -s -d
var sassmin = require('gulp-clean-css');
//获取gulp自动加前缀组件，安装 cnpm i gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer')
//获取文件重命名组件，安装 cnpm i gulp-rename -s -d
var rename = require('gulp-rename');
//获取监视组件，安装 cnpm i gulp-watch -s -d
var watch = require('gulp-watch');
//获取px转rem组件，安装 cnpm i gulp-px2rem-plugin -s -d
var px2rem = require('gulp-px2rem-plugin');
//获取js压缩组件，安装 cnpm i gulp-uglify -s -d
var uglify = require('gulp-uglify');
//获取合并组件，安装 cnpm i gulp-concat -s -d
var concat = require('gulp-concat');
//获取gulp图片文件压缩组件，安装方式 cnpm i gulp-imagemin -s -d
//var imagemin = require('gulp-imagemin');
//获取html文件压缩组件，安装 cnpm i gulp-htmlmin -s -d 
var htmlmin = require('gulp-htmlmin');
//获取connect热加载插件，安装 cnpm i gulp-connect -s -d
var connect = require('gulp-connect');
//获取es6转es5插件，安装 cnpm i gulp-babel -s -d
var babel = require('gulp-babel');
//cnpm i gulp pump gulp-sass gulp-clean-css gulp-autoprefixer gulp-rename gulp-watch gulp-px2rem-plugin gulp-uglify gulp-concat gulp-htmlmin gulp-connect gulp-babel -s
//定义es6任务

//复制文件
gulp.task('copy', function() {
	pump([
		gulp.src(['src/**/*', '!src/sass/**/*']),
		gulp.dest('dist/')
	])

});

//定义sass任务
gulp.task('sass', function() {
	pump([
		//获取资源
		gulp.src('src/sass/index.scss'),
		//编译及检测error	
		sass().on('error', sass.logError),
		//转rem
		px2rem({
			'width_design': 375,
			'valid_num': 6,
			'pieces': 10,
			'ignore_px': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			'ignore_selector': ['.class1']
		}),
		//自动加前后缀
		autoprefixer({
			browsers: ['last 99 versions', 'Android >= 4.0'],
			cascade: true, //是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
			//        transform: rotate(45deg);
			remove: false //是否去掉不必要的前缀 默认：true
		}),
		//保存编译文件
		gulp.dest('dist/css'),
		//重命名文件
		rename('main.min.css'),
		//压缩文件
		sassmin(),
		//保存压缩文件
		gulp.dest('dist/css'),
		connect.reload()
	])

});
//定义javascript任务
gulp.task('javascript', function() {
	pump([
		//获取资源
		gulp.src(['src/js/**/*.js']),
		//合并文件
		concat('index.js'),
		//重命名文件
		rename('index.min.js'),
		//压缩文件
		uglify(),
		//保存文件
		gulp.dest('dist/js/'),
		connect.reload()
	])
});
//定义connect热加载任务
gulp.task("connect", function() {
	connect.server({
		root: 'dist',
		livereload: true
	});

});

//定义html文件压缩
gulp.task('htmlmin', function() {
	pump([
		gulp.src('src/**/*.html'),
		htmlmin({
			removeComments: true, //清除HTML注释
			collapseWhitespace: true, //压缩HTML
			collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
			removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
			removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
			removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
			minifyJS: true, //压缩页面JS
			minifyCSS: true //压缩页面CSS
		}),		
		gulp.dest('dist/'),
		connect.reload()
	])
});

//定义监视任务
gulp.task('watch', function() {
	//监视sass任务
	gulp.watch('src/sass/**/*.scss', ['sass']);
	//gulp.watch(['src/**/*.html'], ['htmlmin']);
	gulp.watch(['src/js/**/*.js'], ['javascript']);
	
});
gulp.task('es', function() {
	return gulp.src("src/es/**/*.js")
		.pipe(babel())
		.pipe(gulp.dest("dist/js"))
		
});
//默认任务
gulp.task('default', ['connect', 'watch'])