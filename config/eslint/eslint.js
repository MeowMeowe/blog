const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    extends: ['prettier'],
    rules: {
        indent: ['error', 4, { VariableDeclarator: 2, SwitchCase: 1 }],
        quotes: [2, 'single'], //单引号
        'no-console': 1, //不禁用console
        'no-debugger': 1, //禁用debugger
        'no-var': 2, //对var警告
        semi: 2, //强制使用分号
        'new-cap': 0, //要求构造函数首字母大写
        'multiline-ternary': [0, 'always'],
        'keyword-spacing': 2, //强制在对象字面量的属性中键和值之间使用一致的间距
        'no-irregular-whitespace': 0, //不规则的空白不允许
        'no-trailing-spaces': 0, //一行结束后面有空格就发出警告
        'eol-last': 0, //文件以单一的换行符结束
        'no-underscore-dangle': 0, //标识符不能以_开头或结尾
        'no-lone-blocks': 0, //禁止不必要的嵌套块
        'no-class-assign': 2, //禁止给类赋值
        'no-const-assign': 2, //禁止修改const声明的变量
        'no-delete-var': 2, //不能对var声明的变量使用delete操作符
        'no-dupe-keys': 2, //在创建对象字面量时不允许键重复
        'no-duplicate-case': 2, //switch中的case标签不能重复
        'no-dupe-args': 2, //函数参数不能重复
        'no-empty': 2, //块语句中的内容不能为空
        'no-func-assign': 2, //禁止重复的函数声明
        'no-invalid-this': 0, //禁止无效的this，只能用在构造器，类，对象字面量
        'no-redeclare': 2, //禁止重复声明变量
        'no-spaced-func': 2, //函数调用时 函数名与()之间不能有空格
        'no-this-before-super': 2, //在调用super()之前不能使用this或super
        'no-undef': 2, //不能有未定义的变量
        'no-shadow': 2, //禁止变量声明与外层作用域的变量同名
        'no-use-before-define': 2, //未定义前不能使用
        camelcase: 0, //强制驼峰法命名  请求中有不遵守。。。
        'no-unreachable': 1, //不能有无法执行的代码
        'comma-dangle': 0, //对象字面量项尾不能有逗号
        'no-mixed-spaces-and-tabs': 0, //禁止混用tab和空格
        'prefer-arrow-callback': 0, //要求使用箭头函数作为回调
        'arrow-parens': 0, //箭头函数用小括号括起来
        'arrow-spacing': 2, //=>的前/后空格
        'jsx-quotes': [2, 'prefer-double'], //强制在JSX属性（jsx-quotes）中一致使用双引号
        'react/display-name': 0, //防止在React组件定义中丢失displayName
        'react/forbid-prop-types': [2, { forbid: ['any'] }], //禁止某些propTypes

        'react/no-did-mount-set-state': 0, //防止在componentDidMount中使用setState
        'react/no-did-update-set-state': 2, //防止在componentDidUpdate中使用setState
        'react/no-direct-mutation-state': 2, //防止this.state的直接变异
        'react/no-multi-comp': 0, //防止每个文件有多个组件定义
        'react/no-set-state': 0, //防止使用setState
        'react/prefer-es6-class': 2, //为React组件强制执行ES5或ES6类
        'react/prop-types': 0, //防止在React组件定义中丢失props验证
        'react/self-closing-comp': 0, //防止没有children的组件的额外结束标签

        'no-extra-boolean-cast': 1, //禁止不必要的bool转换

        'react/no-this-in-sfc': 2, //使用解构，防止this变更
        'react/no-unsafe': 2,
        'react/no-unused-state': 0, //防止未使用状态属性的定义
        'react/no-will-update-set-state': 2, //阻止使用setStateincomponentWillUpdate
        'react/prefer-stateless-function': 0, //强制将无状态React组件编写为纯函数
        'react/void-dom-elements-no-children': 2, //防止非包裹元素包含子节点

        'no-constant-condition': 0,
        'no-await-in-loop': 'error',
        'no-cond-assign': ['error', 'except-parens'], //禁止在条件表达式中使用赋值语句
        'no-ex-assign': 'error', // 此规则不允许在catch子句中重新分配例外。
        'no-extra-parens': [
            1,
            'all',
            {
                // 忽略附加括号   http://eslint.org/docs/rules/no-extra-parens
                conditionalAssign: true,
                nestedBinaryExpressions: false,
                returnAssign: false,
            },
        ],
        'no-extra-semi': 'error', // 禁止使用不必要的分号。 let x = 4 ;;
        'no-invalid-regexp': 'error', // 不允许RegExp构造函数中的无效正则表达式字符串。
        'no-obj-calls': 'error', // 不允许调用Math，JSON和Reflect对象作为功能。 错误 var json = JSON(); 正确var object = JSON.parse("{}");
        /*   不允许直接在Object.prototype对象实例上调用某些方法。 
        错误 var hasBarProperty = foo.hasOwnProperty("bar"); 
        正确 var hasBarProperty = Object.prototype.hasOwnProperty.call(foo, "bar"); */
        'no-prototype-builtins': 'error',
        'no-regex-spaces': 'error', // 正则表达式文字中不允许有多个空格。  如需指定多个 var re = /foo {3}bar/;
        'no-template-curly-in-string': 'error', // 警告常规字符串包含看起来像模板字面占位符的内容 错误 "Hello ${name}!"; 正确 `Hello ${name}!`;
        'no-unexpected-multiline': 'error', // 不允许混淆多行表达式，换行符看起来像是结束语句，但不是。  上面我们已强制分号  不会引发该类错误
        'no-unsafe-finally': 'error', // disallow return/throw/break/continue inside finally blocks
        'no-unsafe-negation': 'error', // 此规则不允许否定关系运算符的左操作数。
        'no-alert':  'warn',
        'no-caller': 'warn', // 阻止使用已弃用和次优代码，但不允许使用arguments.caller和arguments.callee
        'no-empty-function': [
            'error',
            {
                // 消除空功能。如果函数包含注释，则该函数不会被视为问题。
                allow: ['arrowFunctions', 'methods'],
            },
        ],
        'no-eval': 'warn',
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-self-assign': 'error', // 禁止自我分配
        'no-self-compare': 'error',
        'no-sequences': 'error', // 禁止使用逗号运算符，但以下情况除外：在for语句的初始化或更新部分。 如果表达式序列显式包含在圆括号中。
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        '@typescript-eslint/no-unused-vars':  'warn',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'react', 'react-hooks', , 'jsx-control-statements', 'prettier'],
};
