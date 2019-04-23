model可调用方法常用封装
====

使用方式
----
```
const mongoose = require('./index.js')
mongoose.FN(model, conditions, update, options)
model：实例化后model
conditions：文档对象或者文档对象list或者 id值，或者查询条件等 默认值 null 详情参考[官网](https://mongoosejs.com/docs/api.html#Model)
update : 更新后文档对象或者更新条件或者等 默认值 null 详情参考[官网](https://mongoosejs.com/docs/api.html#Model)
options： 返回值设置等 默认值 null 详情参考[官网](https://mongoosejs.com/docs/api.html#Model)

```

例子
```
mongoose.create(model, docs)
```