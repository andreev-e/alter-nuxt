import path from 'path';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

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
        '~assets/css/common',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        {
            src: '~/plugins/vue2-google-maps',
            mode: 'client',
            ssr: false,
        },
        '~/plugins/font-awesome',
        '~/plugins/country-flag',
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/eslint
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
        '@nuxtjs/moment',
        '@nuxtjs/auth-next',
        '@nuxtjs/i18n',
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
        postcss: null,
    },

    axios: {
        baseURL: `${process.env.API_URL}/api/`,
        proxy: true,
        credentials: true,
        responseInterceptor: (response, { store }) => {
            if (response.status === 401) {
                store.$auth.logOut();
            }
            return response;
        },
    },
    proxy: {
        '/api': process.env.API_URL,
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
            laravelSanctum: {
                provider: 'laravel/sanctum',
                url: '/api',
            },
            local: false,
        },
    },
};
