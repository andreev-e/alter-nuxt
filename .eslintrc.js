module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'airbnb-base',
        'plugin:vue/vue3-recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'vue',
    ],
    rules: {
        'vue/script-indent': ['error', 4, { baseIndent: 1 }],
        indent: ['error', 4],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/mustache-interpolation-spacing': ['error', 'always'],
        'import/no-extraneous-dependencies': ['error', {
            devDependencies: true,
        }],
        'vue/match-component-file-name': ['error', {
            extensions: ['vue'],
            shouldMatchCase: false,
        }],
        'vue/html-indent': ['error', 4],
        'no-param-reassign': ['error', { props: false }],
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
                'max-len': 'off',
            },
        },
    ],
};
