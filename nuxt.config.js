process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

export default {
    target: 'server',

    // Современные браузеры получают сборку без лишних полифиллов и транспиляции
    modern: process.env.NODE_ENV === 'production' ? 'server' : false,

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
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~/plugins/font-awesome',
        '~/plugins/image-fallback.client',
        '~/plugins/locale',
        '~/plugins/locale.client',
        '~/plugins/seo',
        '~/plugins/date',
        '~/plugins/element',
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
    ],

    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
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
        // На доменах вне списка (localhost) иначе не загружается ни один язык
        defaultLocale: 'ru',
    },

    // Подключаем только используемые компоненты, а не всю библиотеку
    bootstrapVue: {
        // Стили bootstrap-vue нужны только его собственным компонентам
        // (таблицы, календарь и т. п.), у нас их нет
        bootstrapVueCSS: false,
        componentPlugins: [
            'LayoutPlugin',
            'SpinnerPlugin',
            'PaginationPlugin',
            'TabsPlugin',
            'ButtonPlugin',
            'FormGroupPlugin',
            'FormTextareaPlugin',
            'FormCheckboxPlugin',
        ],
        directivePlugins: [],
    },

    build: {
        // Стили отдельными минифицированными файлами, которые кэширует браузер,
        // а не в HTML каждой страницы
        extractCSS: true,
        babel: {
            compact: true,
        },
        postcss: null,
        extend(config, { isClient }) {
            // Готовый UMD-бандл MapLibre использует синтаксис, который не понимает парсер webpack 4
            config.module.noParse = /maplibre-gl[\\/]dist[\\/]maplibre-gl\.js$/;
            if (isClient) {
                // .mjs-модули (auth-next) иначе получают CommonJS-сборку Vue,
                // и в бандле оказываются две копии
                // eslint-disable-next-line no-param-reassign
                config.resolve.alias.vue$ = 'vue/dist/vue.runtime.esm.js';
            }
        },
    },

    publicRuntimeConfig: {
        maptilerKey: process.env.MAPTILER_KEY,
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
        '~/server-middleware/redirect-www',
        '~/server-middleware/seo-files',
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
        // Without expires the auth cookies die with the browser session,
        // although Laravel keeps the user logged in via the remember cookie.
        cookie: {
            options: {
                expires: 365,
            },
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
