module.exports = {
    rules: {
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/{jsx-rule}.md
        'react/jsx-closing-tag-location': 'error', // 校验闭合tag在 JSX 中的位置
        'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }], // 每行最多一个属性 props

        'react/jsx-first-prop-new-line': [2, 'multiline-multiprop'], // 每行第一个属性 位置
        'react/jsx-no-bind': [
            'error',
            {
                ignoreRefs: true,
                allowArrowFunctions: true,
                allowFunctions: false,
                allowBind: false,
                ignoreDOMComponents: true,
            },
        ], //JSX中不允许使用箭头函数和bind
        'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }], // 禁止重复相同属性 忽略大小写
        'react/jsx-no-undef': 'error', // 未声明 组件 禁止使用 Disallow undeclared variables in JSX
        /* 'react/jsx-pascal-case': ['error', {
            allowAllCaps: true, // 帕斯卡命名法【PascalCase】： 与骆驼命名法类似。只不过骆驼命名法是首字母小写，而帕斯卡命名法是首字母大写
            allowNamespace: true,
            ignore: [],
          }], */
        'react/jsx-uses-react': ['error'], // Prevent React to be incorrectly marked as unused 防止反应被错误地标记为未使用
        'react/jsx-uses-vars': 'error', //  防止在JSX中使用的变量被错误地标记为未使用
        'react/no-danger': 'off', // dangerous JSX properties  dangerouslySetInnerHTML={{ __html: "Hello World" }}
        'react/no-deprecated': ['error'], // 已废弃方法  componentWillMount() { } willxxx...  如要必须 使用： UNSAFE_componentWillMount() { }
        'react/no-string-refs': 'error', // ref 直接string  ref="xxx"
        'react/no-unknown-property': 'error', //防止使用未知的DOM属性
        'react/react-in-jsx-scope': 'error', // JSX 必须import React
        'react/require-render-return': 'error', // Require render() methods to return something
        // method / 生命周期 顺序
        'react/sort-comp': [
            'error',
            {
                order: [
                    'static-variables',
                    'static-methods',
                    'instance-variables',
                    'lifecycle',
                    '/^handle.+$/',
                    '/^on.+$/',
                    'getters',
                    'setters',
                    '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
                    'instance-methods',
                    'everything-else',
                    'rendering',
                ],
                groups: {
                    lifecycle: [
                        'displayName',
                        'propTypes',
                        'contextTypes',
                        'childContextTypes',
                        'mixins',
                        'statics',
                        'defaultProps',
                        'constructor',
                        'getDefaultProps',
                        'getInitialState',
                        'state',
                        'getChildContext',
                        'getDerivedStateFromProps',
                        'componentWillMount',
                        'UNSAFE_componentWillMount',
                        'componentDidMount',
                        'componentWillReceiveProps',
                        'UNSAFE_componentWillReceiveProps',
                        'shouldComponentUpdate',
                        'componentWillUpdate',
                        'UNSAFE_componentWillUpdate',
                        'getSnapshotBeforeUpdate',
                        'componentDidUpdate',
                        'componentDidCatch',
                        'componentWillUnmount',
                    ],
                    rendering: ['/^render.+$/', 'render'],
                },
            },
        ],
        // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
        // 组件 换行
        'react/jsx-wrap-multilines': [
            'error',
            {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'parens-new-line',
            },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }], // 只有jsx文件 返回 JSX return <div>xxx</div>
        // This rule prevents comment strings (e.g. beginning with // or /*) from being accidentally injected as a text node in JSX statements.
        'react/jsx-no-comment-textnodes': 'error', //  <div>// empty div</div>  <div>  /* empty div */  </div>
        'react/no-render-return-value': 'error', // render 函数中 return value
        'react/no-find-dom-node': 'error', // 不推荐使用 findDOMNode  即将废弃
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
        'react/no-unescaped-entities': 'error', // 检测标签中使用特殊符号（强行转义） 未闭合标签  > 等特殊处理 {'>'}  || &gt;
        'react/jsx-space-before-closing': ['off', 'always'],
        'react/no-array-index-key': 'error',
        'react/no-redundant-should-component-update': 'error', // 包含shouldComponentUpdate 的class组件 extends PureComponent 无意义
        'react/no-adjacent-inline-elements': 'error', // 行内元素 一行 要存在空格

        'react/jsx-closing-bracket-location': [1, { selfClosing: 'after-props' }], //在JSX中验证右括号位置
        'react/jsx-curly-spacing': [2, { when: 'never', children: true }], //在JSX属性和表达式中加强或禁止大括号内的空格。
        'react/jsx-indent': [2, 4, { checkAttributes: true }],
        'react/jsx-indent-props': [2, 4], //验证JSX中的props缩进
        'react/jsx-key': 2, //在数组或迭代器中验证JSX具有key属性
        'react/jsx-boolean-value': 2, //在JSX中强制布尔属性符号
        'react/jsx-no-literals': 0, //防止使用未包装的JSX字符串
        'react/jsx-pascal-case': 0, //为用户定义的JSX组件强制使用PascalCase
        'react/jsx-sort-props': 0, //强化props按字母排序
        'react/jsx-equals-spacing': 2, //在JSX属性中强制或禁止等号周围的空格
        'react/jsx-tag-spacing': [2, { beforeSelfClosing: 'always' }],
        'react/jsx-props-no-multi-spaces': 2, //禁止内联JSX道具之间的多个空格
    },
};
