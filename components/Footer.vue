<template>
    <div class="row footer">
        <div class="first_menu col-sm-4">
            <!--      <router-link to="/register/">Регистрация</router-link>-->
        </div>
        <div class="copyright col-sm-4">
            2009-{{ year }} © Альтернативный путеводитель
        </div>
        <div class="second_menu col-sm-4">
            <router-link to="/user/">
                Авторы
            </router-link>
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
