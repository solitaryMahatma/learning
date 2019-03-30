对象映射 targetToSource(options)
====

options.target
---
目标对象，一般是前端页面渲染所用到的字段名集合(对象)

options.source
---
源对象，一般是后端提供字段名集合(对象)

options.map
----
映射对象，key取值为前端所用到的字段名, value后端所用到的字段名


options.positive
----
取值是布尔类型，默认是false,即source值映射到target;取值true时，则与默认行为相反


```
		var target = {
			name: "xiaobai",
			age: 34
		}
		var source = {
			userName: "x小看",
			userAge: 333
		}
		 var map ={
			 name: "userName",
			 age: "userAge"
		 }
		 
		 function targetToSource({target,source,map, positive = false} = {}) {
		 	for(var i in map){
				if (positive) 
					source[map[i]] = target[i] 
				else 
					target[i] = source[map[i]]
			}
		 }

```