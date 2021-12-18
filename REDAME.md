## 手写一个简易的webpack
### 实现目标
- 1 可以将ES6语法转换成ES5语法
- 2 可以分析模块之间的依赖关系
- 3 生成的js文件, 可以在浏览器中运行

### 实现原理
- 可以将ES6语法转换成ES5语法:
  - 通过babylon 生成AST
  - 通过babel-core 将AST重新生成源码
- 可以分析模块之间的依赖关系:
  - 通过babel-traverse的ImportDeclaration方法获取依赖属性
