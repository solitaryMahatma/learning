
serve.js
---

```
const express = require('express')
const app = express()
const systems = require('./route/systems')

// 挂载中间件
app.use(express.static(__dirname + '/staic'))

// 挂载路由

app.use("/system", systems)

// 监听端口
app.listen(3000);
```

systems.js
---

```
const express = require('express');
const app =  express()
const route = express.Router()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


// 挂载处理post请求的中间件 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//设置路由
route.get('url', function (req, res, next){
	res.json(req.query)
    res.end()
})
route.post('url', function (req, res, next){
	res.json(req.fields)
    res.end()
})
route.post('url', function (req, res, next){
	res.json(req.fields)
    res.end()
})
route.put('url', function (req, res, next){
	res.json(req.fields)
    res.end()
})
route.delete('url', function (req, res, next){
	res.json(req.fields)
    res.end()
})
```