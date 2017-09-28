# Agile UI框架

Agile UI框架是一个基于HTML5的UI模块化框架，可以让您的UI组件化使用，更容易维护和复用。

下面均以aui简称


# 用法

aui用于模块化使用ui，使用前需要先创建组件原型new AuiComponent(原型)，然后在使用<aui-XXX></aui-XXX>来使用
其中AuiComponent为aui的一个类，XXX为组件原型的tag属性，即标签名。

具体用法请看“使用”。


# 使用


aui本身用webpack打包可直接在页面使用script引用；也可以被agile-cli工具或者自己搭建的webpack环境下引用。

需要注意的是，使用script引用时，style标签的内容将直接添加到页面中，故不支持less、sass，且import的路径请注意是相对于页面的地址；**而在webpack中使用由于使用aui-loader，style元素内可以支持less、sass以及相对路径的import写法，默认style为标准css，可以给style元素设置type为less|sass等以支持对应的语法。**



## 使用script引用

第一步：dist目录是使用webpack打包后的文件所在目录，其中的agile.ui.js拷贝到项目目录中使用script的src引入即可。

比如：

```html
    <script src="./agile.ui.js" type="text/javascript"></script>
```

引入后，window对象自动创建aui对象，如果是在amd环境的require下也会注册一个名为aui的模块，此模块包含一个叫AuiComponent的类

第二步：使用组件前需要先创建组件，比如在amd的require中创建一个button1的组件：

```javascript

	// button1.js文件内容
    define(['aui'], function(aui) {
    	'use strict';
		// 创建一个组件原型
    	var Button = function () {
        
    	}
	    Button.prototype = {
			// 组件创建完毕的回调
	        created: function () {
	            console.log('button1组件已创建');
	        },
			// 组件添加到页面后的回调
	        attached: function(){
	            console.log('button1组件已添加到dom');
	        }
	    }
		// 定义组件的标签名
	    Button.tag = 'button1';
		// 定义组件内的模板，模板会被作为组件的子元素存在
	    Button.template = '<button>这是button1</button>';
		// 定义组件的样式
	    Button.style = 'aui-button1 button{ background:#ff0000; }';
		// 通过原型实例化组件
	    new aui.AuiComponent(Button);
	
	    return Button;
	});

```


第三步：在页面中使用<aui-tag></aui-tag>来引用即可

```html

	<!-- html页面内容 -->
    <script>
		$(function () {
			require(['./button1'], function () {
				$('#app').append('<aui-button1></aui-button1>');
			});
		})
	</script>

```


## 在agile-cli环境下使用


第一步：执行如下指令，全局安装agile-cli

```bash

	npm install agile-cli -g

```

第二步：创建任意项目目录，并进入目录

```bash

	mkdir myapp
	cd myapp

```

第三步：查看内置模板

```bash

	agile-cli ls

```

此时控制台会以name:descriptiond的形式把所有模板展示出来，如果已知要使用的模板的name则此步跳过

第四步：使用模板创建项目工程

```bash

	agile-cli use <name>

```

其中name为第三步中查到的某个模板的name，这时候将使用此模板创建项目

创建结束项目工程目录会有一个readme文件，请仔细阅读


第五步：初始化工程
	
```bash

	npm install

```

第六步：启动开发环境

```bash

	npm run start

```

第七步：编码，主要在app目录内完成，public目录可以操作一些静态资源

第八步：打包
	
```bash

	npm run pack

```


## 自建webpack环境下使用


webpack环境下使用后缀为aui的文件编写组件，依赖于aui-loader


第一步：进入到项目目录，然后执行cmd指令

```bash

    npm install agile-ui --save

	npm install aui-loader --save-dev

```


并且配置webpack的aui文件使用aui-loader处理，在module.rules增加如下规则：

```json

    {
    	test: /\.aui$/,
        use: {
        	loader: "aui-loader"
        }
    }

```



第二步：在webpack.config配置的入口js中引入agile-ui，比如:

```javascript

    require('agile-ui');

```


第三步：编写组件，创建XXX.aui文件，比如button.aui文件：

```html

    <ui>
	    <box class="button-out" style="flex:1;">
	        <box style="border:1px solid #000;">
	            <text>111</text>
	            <text>222</text>
	        </box>
	        <scroll style="flex:1;border:1px solid #000;">
	            <box style="height:1000px;">
	                <text style="">444</text>
	                <child></child>
	            </box>
	        </scroll>
	    </box>
	</ui>

	<script>
	    var Button = function () {
	    
	    }
	    Button.prototype = {
	        created: function () {
	            console.log('button组件已创建');
	            //console.log(this.content);
	        },
	        attached: function(){
	            console.log('button组件已添加到dom');
	        }
	    }
	
	    Button.tag = 'button';
	
	    module.exports = Button;
	</script>
	
	<style>
	.button-out{
	    background: #ff0000;
	}
	</style>

```

aui-loader会将文件转成js并自动调用AuiComponent来创建组件

其中ui标签里的内容是模板（不包含ui标签本身），最终会作为组件的子元素。

script为模块定义，如果已经写了ui和style标签则无须设置template和style，属性

如果没有特殊要求，tag属性也可以不设置，默认使用aui的文件名作为组件名

在ui中可以看到有个child元素，此元素的作用是当组件本身同时有模板和子元素的时候，由于模板会作为子元素，而原来的子元素会被放置在child元素的位置，一个模板仅有一个child元素


第四步：引入组件，在需要的地方require进来即可，比如：

```javascript

	require('./app/components/button.aui');

```

第五步：使用组件，在页面中使用<aui-tag></aui-tag>即可使用，比如

```javascript

	document.querySelector('#app').innerHTML = '<aui-button>111</aui-button>';

```

# API说明

## AuiComponent

AuiComponent是aui框架的核心类，用于创建aui组件。

### 用法：

```javascript

	new AuiComponent(anestor);

```

其中anestor是一个组件原型，此原型是必须是一个具有构造函数的函数/类


原型包括静态属性tag、template和style，AuiComponent还提供created、attached、detached、adopted、attributeChanged等组件生命周期钩子函数


一个典型的原型定义如下：

```javascript

	// 定义原型
    function anestor(){
	}
	
	// 设置钩子及其他函数
	anestor.prototype = {
		created: function(){
			// this.$el 将得到组件的原生dom对象
			// 当组件创建完毕进入
		},
		attached: function(){
			// 当组件被加到dom后进入
		},
		adopted: function(){
			// 当组件从就文档移到新文档后进入
		},
		detached: function(oldDocument, newDocument){
			// 当组件被dom移除后进入
		},
		attributeChanged: function(attrName, oldVal, newVal){
			// 当组件有属性变化的时候进入，使用setAttribute操作属性有效
			// 需要配合静态属性observedAttributes使用
		}
	}
	
	anestor.tag = '';// 定义组件名称，使用时为<aui-tag></aui-tag>
	anestor.template = '';// 定义组件模板
	anestor.style = '';// 定义组件样式
	anestor.observedAttributes = ['组件属性名'];// 定义监听变化的属性
	
```

#### tag（必须）

用于标识组件的名称，一般为英文数字全小写


#### template

组件的模板，最终会作为组件的子元素

其中template可以包含一个特殊的元素<child></child>
当使用组件时，组件本身有子元素，则子元素最终会至于template的child元素所在位置

#### style

组件的样式，会作为html的style元素添加到页面中

一般样式都以.aui-tag开头可以避免组件之间的样式混乱


#### observedAttributes

要监听的变化的属性名的数组集合，只有设置了监听的属性在变化的时候才会通知attributeChanged


#### created

当组件创建完毕进入

#### attached

当组件被加到dom后进入

### adopted

当组件从就文档移到新文档后进入

#### detached

当组件被dom移除后进入

#### attributeChanged

当组件有属性变化的时候进入，使用setAttribute操作属性有效


### 其他

aui组件一旦使用就会创建一个对应的原型实例对象，对象内可使用$el获取实例对象对应的标准的dom对象。



