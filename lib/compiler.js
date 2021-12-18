const path = require('path')
const fs = require('fs')
const { getAst, getDependencies, trasform } = require('./parser')

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = [] // 模块队列
  }

  // 入口函数
  run() {
    const entryModule = this.buildModule(this.entry, true)
    // console.log(entryModule.transformCode)

    this.modules.push(entryModule)
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    // console.log(this.modules)

    this.emitFiles()
  }

  // 编译模块
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
        ast = getAst(filename);
    } else {
        let absolutePath = path.join(process.cwd(), './src', filename);
        ast = getAst(absolutePath);
    }
    // let ast;
    // // 源码转化成ast抽象语法树
    // if(isEntry) {
    //   ast = getAst(filename)
    //   // console.log(ast)
    // } else { // 非入口文件
    //   const absolutePath = path.join(process.cwd(), './src', filename)
    //   ast = getAst(absolutePath)
    // }

    return {
      filename,
      dependencies: getDependencies(ast),
      transformCode: trasform(ast)
    }
  }

  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename)
    let modules = '';
    this.modules.map((_module) => {
        modules += `'${ _module.filename }': function (require, module, exports) { ${ _module.transformCode } },`
    });
    console.log(modules)
    
    const bundle = `
        (function(modules) {
            function require(fileName) {
                const fn = modules[fileName];
    
                const module = { exports : {} };
    
                fn(require, module, module.exports);
    
                return module.exports;
            }

            require('${this.entry}');
        })({${modules}})
    `
    
    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}