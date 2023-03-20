<template>
    <div>
        <a
            v-if="host!== 'altertravel.ru'"
            href="https://altertravel.ru"
        >RU</a>
        <a
            v-if="host!== 'altertravel.pro'"
            href="https://altertravel.pro"
        >EN</a>
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
    };
</script>

<style scoped>

</style>
