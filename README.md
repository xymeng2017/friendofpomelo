# friendofpomelo


好友系统是游戏的一个经典功能。这个demo包含添加好友/同意添加/拒绝添加/删除好友以及推送通知功能，适合给pomelo刚入门的人提供借鉴。该demo是在treasures的基础上开发的。


 * Homepage: <http://pomelo.netease.com/>
 * Mailing list: <https://groups.google.com/group/pomelojs>
 * Documentation: <http://github.com/netease/pomelo>
 * Wiki: <https://github.com/netease/pomelo/wiki/>
 * Issues: <https://github.com/netease/pomelo/issues/>
 * Google plus: <https://plus.google.com/communities/111412421246485271700/>
 * Tags: game, nodejs 

## 环境

- node v7.6.0 或更高，以支持ES2015和async/await语法。（node v7.7.x 有bug不要用）
- redis
- mongodb


## 优点/技术点

### 0. 使用pomelo-status-plugin插件全局推送消息

pomelo-status-plugin插件会自动存储每个连接的uid和sid，适合向单个用户推送消息，十分方便。

### 1. 使用ES6+开发

能用ES6+的地方均用了ES6+,node原生执行,没有babel/CoffeeScript/TypeScript那些东东。用async/await、Promise、class、let/const、arrow function等ES6+新特性替换了回调、call()、bind()、apply()、util.inherits()等秀操作的函数。但是由于pomelo框架的限制，大部分地方还是要用回调函数。

### 2. 线程池和mongodb的配合使用

lordofpomelo是线程池和mysql配合使用的例子,这里改为mongodb与线程池配合，给想选择mongodb的提供借鉴，具体在app/dao/mongodb这个文件夹中。

### 3. 含mongodb的唯一数字生成函数

主要原理是利用了findOneAndUpdate这个原子操作。具体在app/dao/IdentifierDao这个类中。

### 4. web-server去除了对component.js依赖

根据Google的javascript编程规范，禁止使用deprecated的东西。这里删除了web-server中对component.js的依赖，大大精简了代码，并且也能更好的适应webstorm的代码高亮。主要原理是，在treasures/web-server/public/js/lib/components/的4个pomelo官方组件中，将
module.exports改为挂接在window变量上，然后把lib文件夹下其余的文件都删掉。

### 5. game-server去除了对bearcat.js的依赖

在ES6+面前，bearcat比较鸡肋，bearcat的func参数带来了函数式编程的恐怖回忆；type参数对于弱类型语言，一个object不足以描述其类型。

### 6. 使用web页面模拟客户端，用于测试服务器

该web页面在web-server下，基于koa框架开发的简易界面。

## 使用步骤

### 0. 用两个chrome和firefox两个浏览器分别模拟两个客户端

打开浏览器的控制台界面，控制台是主要的信息输出地。首先分别注册和登录游戏账号。

![登录界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/login.PNG)

![登录界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/afterlogin.PNG)

### 1. 登录游戏

点击login登录游戏，login的主要过程是执行queryEntry和entry两个函数。

queryEntry是connect gate服务器，并发出request，获取connector的ip和port。

entry是connect connector服务器，并发出request，获取player信息。

如果是第一次登录，则返回player未初始化，此时客户端可输入姓名，点击init按钮，创建角色（略）。

![登录游戏界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/afterlogingame.PNG)

### 2. 添加好友

输入要添加好友的数字id号，点击add进行添加，则会发送添加好友请求，如果对方在线，会推送通知。

![添加好友界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/add.PNG)

![添加好友推送通知界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/push.PNG)

### 3. 同意添加好友

打开另一个浏览器，输入刚才推送的id号，点击agree，则双方成为好友。

![同意添加好友界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/agree.PNG)

### 4. 删除好友

输入好友的id号，点击remove，则双方不再是好友，此时如果对方在线，也会推送通知。

![删除好友界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/remove.PNG)

![删除好友推送通知界面](https://github.com/xymeng2017/friendofpomelo/blob/master/readme-resource/push2.PNG)


## License

(The MIT License)

Copyright (c) 2012-present NetEase, Inc. xymeng2017， and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.