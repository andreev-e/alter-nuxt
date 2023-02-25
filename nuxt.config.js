process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

export default {
    target: 'server',

    head: {
        title: 'altertravel.ru',
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
        {
            src: '~/plugins/simple-alert',
            mode: 'client',
            ssr: false,
        },
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

    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/moment',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        ['@nuxtjs/component-cache', {
            max: 10000,
            maxAge: 1000 * 60 * 60,
        }],
    ],

    build: {
        transpile: [/^vue2-google-maps($|\/)/],
        babel: {
            compact: true,
        },
        postcss: null,
    },

    axios: {
        // baseURL: `${process.env.API_URL}/api/`,
        proxy: true,
        credentials: true,
    },
    proxy: {
        '/api': process.env.API_URL,
    },

    serverMiddleware: [
        '~/server-middleware/logger',
        {
            path: '/',
            handler: '~/server-middleware/redirect',
        },
    ],

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
        },
    },

    sitemap: {
        exclude: [
            '/secure/**',
            '/secure',
            '/login',
            '/register',
            '/izbrannoye',
        ],
    },

    server: {
        port: process.env.PORT || 3000,
    },
};
