// eslint-disable-next-line import/no-extraneous-dependencies
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ['ru'],
        }),
    ],
};
