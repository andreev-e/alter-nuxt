<template>
    <Nuxt />
</template>

<script>
    // Личный кабинет, авторизация и модерация в поиске не нужны
    const NOINDEX = /^\/(secure|login|register|moderation)(\/|$)/;

    export default {
        head() {
            const path = this.$seo.pagePath(this.$route);
            const alternates = this.$i18n.locales.map((locale) => ({
                hid: `alternate-${locale.code}`,
                rel: 'alternate',
                hreflang: locale.code,
                href: this.$seo.url(path, locale.code),
            }));

            return {
                htmlAttrs: {
                    lang: this.$i18n.locale,
                },
                link: [
                    { hid: 'canonical', rel: 'canonical', href: this.$seo.url(path) },
                    ...alternates,
                    {
                        hid: 'alternate-x-default',
                        rel: 'alternate',
                        hreflang: 'x-default',
                        href: this.$seo.url(path, this.$i18n.defaultLocale),
                    },
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
