
js中的闭包
==
###什么是闭包  
---
#####定义
---
一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数），因而这些变量也是该表达式的一部分。  

#####本质
---
闭包是将函数内部和函数外部连接起来的桥梁


#####特点  
---
1.   作为一个函数变量的一个引用，当函数返回时，其处于激活状态。  
2.   一个闭包就是当一个函数返回时，一个没有释放资源的栈区。


#####优点
---

1. 变量长期驻扎在内存中

2. 避免全局变量的污染

3. 私有成员的存在

#####特性
---
1. 函数套函数；

2. 内部函数可以直接使用外部函数的局部变量或参数；

3. 变量或参数不会被垃圾回收机制回收 GC；

#####缺点
---
常驻内存 会增大内存的使用量 使用不当会造成内存泄露，详解：  

1. 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。  

2. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

###举个例子
```
var  counter = 10;
function counte () {
	var  counter = 0;
	return function () {
		counter+=1;
		console.log(counter)
	}
}
//counter =>10
//var s = counte();
//s()// 1
//s()// 2
//s()// 3
//var s0 = counte();
//s0()// 1
//s0()// 2
//s0()// 3

```
###闭包的应用场景
---
保护函数内的变量安全。以最开始的例子为例，函数counte中counter只有匿名函数(或说是闭包s...sn)才能访问，而无法通过其他途径访问到，因此保护了counter的安全性。 在内存中维持一个变量。依然如前例，由于闭包，函数counte中counter的一直存在于内存中，因此每次执行s()，都会给counter自加1。 通过保护变量的安全实现JS私有属性和私有方法（不能被外部访问） 私有属性和方法在Constructor外是无法被访问的

###Javascript闭包的用途
---
事实上，通过使用闭包，我们可以做很多事情。比如模拟面向对象的代码风格；更优雅，更简洁的表达出代码；在某些方面提升代码的执行效率。  
1. 匿名自执行函数
2. 结果缓存(或者解决索引问题)
3. 封装  
```
var person = function(){    
    //变量作用域为函数内部，外部无法访问    
    var name = "default";       

    return {    
       getName : function(){    
           return name;    
       },    
       setName : function(newName){    
           name = newName;    
       }    
    }    
}();    

print(person.name);//直接访问，结果为undefined    
print(person.getName());    
person.setName("abruzzi");    
print(person.getName());    

得到结果如下：  

undefined  
default  
abruzzi
```
4. 实现类和继承

```
function Person(){    
    var name = "default";       

    return {    
       getName : function(){    
           return name;    
       },    
       setName : function(newName){    
           name = newName;    
       }    
    }    
    };   

    var p = new Person();
    p.setName("Tom");
    alert(p.getName());

    var Jack = function(){};
    //继承自Person
    Jack.prototype = new Person();
    //添加私有方法
    Jack.prototype.Say = function(){
        alert("Hello,my name is Jack");
    };
    var j = new Jack();
    j.setName("Jack");
    j.Say();
    alert(j.getName());

```
###Javascript的垃圾回收机制
---
#####定义
---
在Javascript中，如果一个对象不再被引用，那么这个对象就会被GC回收。如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。因为函数a被b引用，b又被a外的c引用，这就是为什么函数a执行后不会被回收的原因。

#####如何释放闭包的资源栈
---
在不需要继续使用这个闭包的位置，把这个引用闭包的变量赋值 null或者 '',之后会被GC回收
```
var  counter = 10;
function counte () {
	var  counter = 0;
	return function () {
		counter+=1;
		console.log(counter)
	}
}
var s = counte();
s()
s = null

```

----

具体深入理解闭包(这不是我的博客，我只是收藏一下用于学习)可以前往[王福朋 - 博客园 之 深入理解javascript原型和闭包](http://www.cnblogs.com/wangfupeng1988/p/3977924.html)  
