const createObj = arr => {
    const obj = {}
    const len = arr.length
    if (len) {
        arr.map((v, k, a)=>{
            obj[a[k]] = a[k]
        })
    }
    return obj
}


const actions = [
    'count',
    'countDocuments',
    'create',
    'deleteMany',
    'deleteOne',
    'estimatedDocumentCount', 
    'find',
    'findById', 
    'findByIdAndDelete',
    'findByIdAndRemove',
    'findByIdAndUpdate',
    'findOne', 
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndReplace',
    'findOneAndUpdate',
    'insertMany',
    'remove',
    'replaceOne',
    'save',
    'update',
    'updateMany',
    'updateOne'
]
const BOOT = createObj(actions)

const common = (resolve, err, data) => {
    if (err) {
        resolve({
            isOk: false,
            data: err
        })
    } else {
        resolve({
            isOk: true,
            data: data
        })
    }
}




// 保持引用关系
function createAPI(x, callBack) {
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
                    res[k] = (model, conditions=null, update=null, options=null) => callBack(model, conditions, update, options, data[k]) // 向外(model, conditions)暴露的参数
                }
            }
        }
        return root
    }
}

function find(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i]
        }
    }

    return null
}

// 赋予 BOOT 字符串类型的键值对的 方法能力
const endowFunction = (model, conditions, update, options, data) => {
    return new Promise((resolve, reject) => {
        if (!conditions){
            model[data]((err, adventure) => {
                common(resolve, err, adventure)
            })
        }
        if (!update) {
            model[data](conditions, (err, adventure) => {
                common(resolve, err, adventure)
            })
        } else if (!options) {
            model[data](conditions, update,(err, adventure) => {
                common(resolve, err, adventure)
            })
        } else {
            model[data](conditions, update, options,(err, adventure) => {
                common(resolve, err, adventure)
            })
        }
    })
}


const API = createAPI(BOOT, endowFunction)

module.exports = API
