<template>
    <div class="row footer">
        <div class="first_menu col-sm-4" />
        <div class="copyright col-sm-4">
            2009-{{ year }} © Альтернативный путеводитель
        </div>
        <div class="second_menu col-sm-2">
            <router-link to="/user/">
                Авторы
            </router-link>
        </div>
        <div class="second_menu col-sm-2">
            <a
                target="_blank"
                href="https://www.patreon.com/altertravel"
            >
                Patreon
            </a>
            |
            <a
                target="_blank"
                href="https://boosty.to/altertravel"
            >
                Boosty
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                year: 'year',
            };
        },
        mounted() {
            this.year = new Date().getFullYear();
        },
    };
</script>

<style>
</style>
