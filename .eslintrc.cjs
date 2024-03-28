module.exports = {
    env: {
        browser: true,
        es2021: true,
        es6: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/jsx-runtime'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        'no-async-promise-executor': 'off',
        'no-misleading-character-class': 'off',
        'no-useless-catch': 'off',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};