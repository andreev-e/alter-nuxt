<template>
    <div class="row footer text-center">
        <div class="copyright col-sm-5">
            2009-{{ year }} © Альтернативный путеводитель
        </div>
        <div class="second_menu col-sm-2">
            <router-link to="/user/">
                Авторы
            </router-link>
        </div>
        <div class="second_menu col-sm-5">
            <a
                target="_blank"
                href="https://t.me/Altertravel_bot"
            >
                Телеграм бот
            </a>
            <font-awesome-icon
                icon="fa-hand-holding-dollar"
            />
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
  .footer {
    font-size: 20px;
  }
</style>
