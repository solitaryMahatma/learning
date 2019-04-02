const mongoose = require("mongoose")
const dbSetting = require("./DBsettins") //设置数据库参数
//const models = require("../model/models") //设置数据库参数
const options = require("./options")
// 链接数据库
const connect = async () => {
    await mongoose
    .connect(dbSetting.dbUrl, {
        user: dbSetting.userName,
        pass: dbSetting.password
    })
    .then((result)=>{
        //console.log("链接数据库成功")
    }).catch((err)=>{
        //console.log("链接数据库失败")
    })
}

//关闭数据库
const close = async () => {
    await mongoose
    .connection
    .close()
    .then((result) => {
        console.log("关闭数据库成功")
    }).catch((err) => {
        console.log("关闭数据库失败")
    }).finally(()=>{
      Object.keys(mongoose.connection.models).forEach(key => {
        delete mongoose.connection.models[key];
      });
    })
}
//初始化model
const initModel = (collection, model) => mongoose.model(collection, new mongoose.Schema(model))

const initAdditional = (additional)=>{
    additional.sort = additional.sort || {}
    additional.limit = additional.limit || 0
    additional.skip = additional.skip || 0
}

const DBend = (err, callback)=>{
    callback(err)
    close()
}

const doing = async (promise, callback )=>{
    return await promise
    .then((result) => DBend(result, callback))
    .catch((err) => DBend(err, callback));
}
//支持批量添加、删除以及更新,支持分页(排序)查询
const actionData = async ({ acitonType = 'default', collection, model, data = [{}], additional = {} } = {}, callback) => {
    connect()
    const a  = {}
    // object.assign(a, model)
    const createModel = initModel(collection, model)
    let actionArray = []
    for await(let index of options.acitonType){
        actionArray.push(index['type'])
    }
    if (!actionArray.includes(acitonType)) {
        DBend("acitonType: 取值只能是[ 'insert', 'delete', 'find', 'update', 'default' ]之一,此次操作失败", callback)
        return false
    }
    //初始化additional对象，有三个属性 sort,limit,skip
    initAdditional(additional)

    switch (acitonType) {

        case options.acitonType[0]['type']:
            await doing(createModel.insertMany(data), callback)
            break;

        case options.acitonType[1]['type']:
            await doing(createModel.deleteMany(data[0]), callback)
            break;

        case options.acitonType[2]['type']:
            await doing(
                createModel.find(data[0])
                .sort(additional.sort)
                .limit(additional.limit)
                .skip(additional.skip),
                callback)
            break;

        case options.acitonType[3]['type']:
            await doing(createModel.updateMany(data[0], data[1]), callback)
            break;

        case options.acitonType[4]['type']:
            await doing(
                createModel.find(data[0])
                .sort(additional.sort)
                .count(),
                callback)
            break;

        default:
            break;
    }

}

module.exports = {
    actionData: actionData
}
