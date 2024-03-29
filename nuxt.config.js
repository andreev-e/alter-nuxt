process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

export default {
    target: 'server',

    head: {
        title: 'Altertravel',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
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
        {
            src: 'element-ui/lib/theme-chalk/index.css',
            lang: 'scss',
        },
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
        locales: ['ru'],
    },

    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/moment',
        '@nuxtjs/i18n',
        ['@nuxtjs/yandex-metrika', {
            id: 10896850,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
        }],
        ['@nuxtjs/component-cache', {
            max: 10000,
            maxAge: 1000 * 60 * 60,
        }],
        'nuxt-element-ui',
    ],

    i18n: {
        langDir: 'i18n',
        locales: [
            {
                code: 'en', iso: 'en-US', file: 'en.js', domain: 'altertravel.pro',
            },
            {
                code: 'ru', iso: 'ru-RU', file: 'ru.js', domain: 'altertravel.ru',
            },
        ],
        differentDomains: true,
    },

    elementUI: {
        components: ['Row', 'Col', 'Form', 'Input', 'Select', 'Option', 'Button', 'FormItem', 'Message', 'MessageBox'],
        locale: 'ru-RU',
    },

    build: {
        transpile: [/^vue2-google-maps($|\/)/],
        babel: {
            compact: true,
        },
        postcss: null,
    },

    axios: {
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

    server: {
        port: process.env.PORT || 3000,
    },
};
