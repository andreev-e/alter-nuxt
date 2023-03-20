<template>
    <div>
        <a
            v-for="locale in locales"
            :key="locale.code"
            :href="switchLocalePath(locale.code)"
        >
            {{ locale.code.toUpperCase() }}
        </a>
    </div>
</template>

<script>
    export default {
        name: 'LangSwitcher',
        data() {
            return {
                // eslint-disable-next-line no-restricted-globals
                host: location.host,
            };
        },
        computed: {
            locales() {
                return this.$i18n.locales.filter((locale) => locale.code !== this.$i18n.locale);
            },
        },
    };
</script>

<style scoped>
  a {
    line-height: 24px;
    font-size: 16px;
  }
</style>
