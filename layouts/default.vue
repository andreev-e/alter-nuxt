<template>
    <Nuxt />
</template>

<script>
    // Личный кабинет, авторизация и модерация в поиске не нужны
    const NOINDEX = /^\/(secure|login|register|moderation)(\/|$)/;

    export default {
        head() {
            const path = this.$seo.pagePath(this.$route);

            return {
                htmlAttrs: {
                    lang: this.$i18n.locale,
                },
                link: [
                    { hid: 'canonical', rel: 'canonical', href: this.$seo.url(path) },
                ],
                meta: [
                    { hid: 'og:site_name', property: 'og:site_name', content: this.$t('ALTERTRAVEL') },
                    { hid: 'og:locale', property: 'og:locale', content: this.$i18n.localeProperties.iso.replace('-', '_') },
                    { hid: 'og:url', property: 'og:url', content: this.$seo.url(path) },
                    { hid: 'og:image', property: 'og:image', content: this.$seo.url('/logo.png') },
                    { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
                    ...(NOINDEX.test(this.$route.path)
                        ? [{ hid: 'robots', name: 'robots', content: 'noindex, nofollow' }] : []),
                ],
            };
        },
    };
</script>
