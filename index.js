const util = require('./util')


const a = [{
        a: 1,
        b: 2,
        c: [{
            a: 1,
            b: 2,
            c: [1, 2, 3, 4, 5]
        }, {
            a: 1,
            b: 2,
            c: [1, 2, 3, 4, 5]
        }]
    },
    {
        a: 1,
        b: 2,
        c: [1, 2, 3, 4, 5, 6]
    }
]


const b = util.object.deepCopy(a)

b[0]['c'][0]['a'] = 99
console.log(b[0]['c']);
console.log(a[0]['c']);