module.exports = {
    collection: {
        type: 'String',
        describe: '插入集合名称'
    },
    model: {
        type: 'Object',
        describe: 'mongoose.model'
    },
    data: {
        type: 'ArrayObject',
        describe: '插入模式不限制长度数组对象，查询模式或者删除模式数组长度为一, 更新模式数组长度为2,下标0是查询条件或者旧数据，下标1是设置条件或者新数据',
        default: [{}]
    },
    callback: {
        type: 'Function',
        describe: '插入对象或者查询条件或者删除条件或者更新对象',
        backValue: {
            ags: 'result',
            describe: '插入成功的对象，或者符合条件数组对象，或者删除成功的条数',
        }
    },
    additional: {
        type: "Object",
        describe: '额外条件',
        arg: [
            {
                name: "sort",
                type: "Object",
                describe: '排序条件'
            },
            {
                name: "limit",
                type: "Number",
                describe: '一页显示多少条信息'
            },
            {
                name: "skip",
                type: "忽略信息条数",
                describe: '排序条件'
            }
        ]
    },
    acitonType: [
        {
            type: 'insert',
            describe: '插入数据'
        },
        {
            type: 'delete',
            describe: '删除数据'
        },
        {
            type: 'find',
            describe: '查看数据'
        },

        {
            type: 'update',
            describe: '更新数据'
        },
        {
            type: 'default',
            describe: '查看符合查询条件的信息条数'
        }
    ]
}