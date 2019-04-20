前端axios RESTFUL接口API设计
===

第一步 config.js
-------

```
export default {
  baseUrl: {
    dev: 'http://localhost:3000/admin',
    pro: 'https://produce.com'
  }
}
```

第二步 配置 axios.js
------

```
import axios from 'axios'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest

```

第三步 实例化 api.request.js
-----

```
import HttpRequest from './axios'
import config from './config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)
export default axios

```

第四部 初始化封装  api.axios.js

```
import axios from './api.request'

const API = (method, url, data) => {
  const type = method.toLowerCase()
  const dataObj = type === 'get' ? { params: data } : { data }
  return axios.request(Object.assign({
    url: url,
    method: type
  }, dataObj))
}

export default API
```

第五步 创建RESTFUL接口
-----

```
import axios from '@/libs/api.axios.js'

const BOOT = {
  onLive: {
    discounts: '/onlive/discounts',
    gift: '/onlive/gift',
    product: '/onlive/product',
    recharge: '/onlive/recharge',
    redpacket: '/onlive/redpacket',
    rooms: '/onlive/rooms'
  },
  stystem: {
    user: '/stystem/user',
    role: '/stystem/role',
    level: '/stystem/level',
    area: '/stystem/area'
  },
  city: {
    city: '/city'
  }
}


// 保持引用关系
function createAPI (x) {
  // =============
  const uniqueList = [] // 用来去重
  // =============

  let root = {}

  // 循环数组
  const loopList = [{
    parent: root,
    key: undefined,
    data: x
  }]

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }

    // =============
    // 数据已经存在
    let uniqueData = find(uniqueList, data)
    if (uniqueData) {
      parent[key] = uniqueData.target

      continue // 中断本次循环
    }

    // 数据不存在
    // 保存源数据，在拷贝数据中对应的引用
    uniqueList.push({
      source: data,
      target: res
    })
    // =============

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          })
        } else {
          res[k] = (method = 'get', data1 = {}) => {
            const url = data[k]
            return axios(method, url, data1)
          }
        }
      }
    }
  }

  return root
}

function find (arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i]
    }
  }

  return null
}

const API = createAPI(BOOT)
export default API

```
nodeJs RESTFUL接口API设计
===


* serve.js

```

const express = require('express')
const app = express()
const route = require('./route')
const formidableMiddleware = require('express-formidable');
const connect = require('./connect')

const ROOT = {
    stystem: "/admin"/
}



connect()
// 跨域设置
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    next()
});

//挂载中间件
app.use(express.static(__dirname + '/static'))

app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: "./static/upload",
    multiples: false,
}))

// 挂载路由
app.use(ROOT.stystem, route)
app.listen(3000);

```
* route.js

```
const express = require('express');
const app =  express();
const route = express.Router();
const bodyParser = require('body-parser');
const control = require('../controller');
const path = require('./path')
const action = require('./action')

// 挂载中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//设置路由
/*route.delete(URL, control.stystemUser)
route.put(URL, control.stystemUser)
route.post(URL, control.stystemUser)
route.get(URL, control.stystemUser)*/



const stystem = {
    user: action.push(route, path.stystem.user, control.stystemUser),
    role: action.push(route, path.stystem.role, control.stystemRole),
    level: action.push(route, path.stystem.level, control.stystemLevel),
    area: action.push(route, path.stystem.area, control.stystemArea)
}

const onLive = {
    discounts: action.push(route, path.onLive.discounts, control.onLiveDiscounts),
    gift: action.push(route, path.onLive.gift, control.onLiveGift),
    product: action.push(route, path.onLive.product, control.onLiveProduct),
    recharge: action.push(route, path.onLive.recharge, control.onLiveRecharge),
    redpacket: action.push(route, path.onLive.redpacket, control.onLiveRedpacket),
    rooms: action.push(route, path.onLive.rooms, control.onLiveRooms),
}

const city = {
    city: action.push(route, '/city', control.cityCity),
}

const file = {
    imageUp: action.imageUp(route, '/upImg', path) //文件上传 重命名文件
}

module.exports = route
```

* controller

```

const action = require('./action')
const model = require('../model');
const initOptions = require('./initOptions')
const stystem = require('./stystem')
const onLive = require('./onLive')
const city = require('./city')
const objectId = require('./objectId')
//console.log(city);


exports.stystemUser = async function (req, res, next) {
  const method = req.method.toUpperCase()
  let message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: method,
    model: model.stystem.user,
  }
  Object.assign(options, initOptions)
  let response;
  putMetho:{
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      stystem.user(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    stystem.user(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}


exports.stystemRole = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.stystem.role
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      stystem.role(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    stystem.role(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}

exports.stystemLevel = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.stystem.level
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      stystem.level(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    stystem.level(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}

exports.stystemArea = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.stystem.area
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      stystem.area(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    stystem.area(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}


exports.cityCity = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.city.city
  }
  Object.assign(options, initOptions)
  let response;
  city.city(message, options, objectId)
  GET:{
    if (method === 'GET') {
      response = await action(options) 
      break GET;
    } 
    response = {
      core: 404,
      msg: '接口不开放'
    }
  }
  //response = await action(options)
  res.json(response)
  res.end()
}















exports.onLiveDiscounts = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.discounts
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.discounts(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.discounts(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}

exports.onLiveGift = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.gift
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.gift(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.gift(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}

exports.onLiveProduct = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.product
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.product(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.product(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}

exports.onLiveRecharge = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.recharge
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.recharge(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.recharge(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}
exports.onLiveRedpacket = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.redpacket
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.redpacket(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.redpacket(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}
exports.onLiveRooms = async function (req, res, next) {
  const method = req.method.toUpperCase()
  const message = (method === "GET" ? req.query : req.fields)
  const options = {
    method: req.method.toUpperCase(),
    model: model.onLive.rooms
  }
  Object.assign(options, initOptions)
  let response;
  putMetho: {
    if (method === 'PUT') {
      //判断message是不是数组  看需求执行批量操作 例如批量上下架(拿到_id集合即可) 或者 批量修改用户(更新)
      message = {
        _id: '5cac66e39df37e3928f9d219',
        userName: 'xiaohong'
      }
      onLive.rooms(message, options, objectId)
      response = await action(options) //批量修改用户(更新) 即循环此语句
      break putMetho
    }
    onLive.rooms(message, options, objectId)
    response = await action(options)
  }
  res.json(response)
  res.end()
}
```