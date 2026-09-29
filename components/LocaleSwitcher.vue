<template>
    <div
        class="locale-switcher"
        :title="$t('HEADER.LANGUAGE')"
    >
        <template v-for="(locale, index) in $i18n.locales">
            <span
                v-if="index"
                :key="`sep-${locale.code}`"
                class="text-muted"
            >|</span>
            <span
                v-if="locale.code === $i18n.locale"
                :key="locale.code"
                class="font-weight-bold"
            >{{ locale.code.toUpperCase() }}</span>
            <a
                v-else
                :key="locale.code"
                href="#"
                @click.prevent="$switchLocale(locale.code)"
            >{{ locale.code.toUpperCase() }}</a>
        </template>
    </div>
</template>

<style scoped>
  .locale-switcher {
    font-size: 14px;
  }
</style>
