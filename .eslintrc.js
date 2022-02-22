
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        // "jquery": true
        jest: true,
        'jsx-control-statements/jsx-control-statements': true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
        },
    },
    globals: {
        "wx": "readonly",
    },
    extends: [
        './config/eslint/eslint.js',
        './config/eslint/react-jsx.js',

        // "eslint:recommended",
        // "plugin:react/recommended",
        // "plugin:jsx-control-statements/recommended", // 需要另外配合babel插件使用
        'prettier',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: [
        "@typescript-eslint/eslint-plugin"
    ],
    rules: {
        "no-console": "off"
    },
};
