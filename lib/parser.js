const fs = require('fs')
const bobylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

module.exports = {
  // 通过第三方库bobylon 把源码转化成AST
  getAst: (filePath) => {
    const context = fs.readFileSync(filePath, 'utf-8')
    return bobylon.parse(context, {
      sourceType: 'module'
    })
  },

  // 获取依赖
  getDependencies: (ast) => {
    const dependencies = []
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value)
      }
    })
    return dependencies
  },

  // ast转化成源码
  trasform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    })

    return code
  }
}