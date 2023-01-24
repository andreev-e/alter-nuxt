import path from 'path';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

export default {
    // Target: https://go.nuxtjs.dev/config-target
    target: 'server',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'alter-nuxt',
        htmlAttrs: {
            lang: 'ru',
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: '',
            },
            {
                name: 'format-detection',
                content: 'telephone=no',
            },
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
        ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~assets/css/common.css',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        {
            src: '~/plugins/vue2-google-maps.js',
            mode: 'client',
            ssr: false,
        },
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/eslint
        '@nuxtjs/moment',
        '@nuxtjs/eslint-module',
    ],

    moment: {
        defaultLocale: 'ru',
        locale: 'ru',
        locales: ['ru'],
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
    // https://go.nuxtjs.dev/bootstrap
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        ['@nuxtjs/component-cache', {
            max: 10000,
            maxAge: 1000 * 60 * 60,
        }],
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: [/^vue2-google-maps($|\/)/],
        babel: {
            compact: true,
        },
    },

    axios: {
        baseURL: 'https://api.altertravel.ru/api',
    },

    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt')),
        },
    },

    serverMiddleware: ['~/server-middleware/logger'],

    auth: {
        redirect: {
            login: '/login',
            logout: '/',
            home: '/secure',
        },
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/user/login',
                        method: 'post',
                        propertyName: 'data.token',
                    },
                    logout: false,
                    user: false,
                },
                tokenType: '',
                tokenName: 'x-auth',
                autoFetchUser: false,
            },
        },
    },

};
