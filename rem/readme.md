移动端适配 --- rem
====


* 新建gulp任务
```
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

```


* 或者使用插件将px 转 rem
---


导入rem.js
----
