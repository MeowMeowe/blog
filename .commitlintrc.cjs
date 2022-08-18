module.exports = {
    ignores: [commit => commit.includes('init')],
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 108],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'feat', // 添加新功能
                'fix', // 修复bug
                'perf', // 提高性能的代码
                'style', // 样式相关的代码
                'docs', // 文档相关的更改
                'test', // 添加新测试或对现有测试进行更改
                'refactor', // 代码重构
                'build', // 构建相关的更改
                'ci',
                'chore', // 构建过程或辅助工具的变动
                'revert', // 回滚到上一个版本
                'workflow',
                'types',
                'release',
                'merge'
            ]
        ]
    }
}
