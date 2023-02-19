<!-- Please remove this file from your project -->
<template>
    <div class="header row">
        <client-only>
            <div class="col-sm-12 d-flex justify-content-end">
                <div
                    v-if="$auth.loggedIn"
                    class="d-flex justify-content-between"
                >
                    <router-link
                        to="/secure/poi/create"
                        class="d-inline-block mr-1 mt-1"
                        title="Добавить достопримечательность"
                    >
                        <font-awesome-icon
                            icon="fa-plus-circle"
                            class="text-success"
                            role="button"
                        />
                    </router-link>
                    <nuxt-link
                        to="/secure"
                        class="d-inline-block mr-1 mt-1"
                    >
                        {{ $auth.user.firstname || $auth.user.lastname ? `${$auth.user.firstname}  ${$auth.user.lastname}` : $auth.user.username }}
                    </nuxt-link>
                    <router-link
                        :to="`/secure/user/${$auth.user.username}`"
                        class="d-inline-block mr-1 mt-1"
                        title="Профиль"
                    >
                        <font-awesome-icon
                            icon="fa-edit"
                            class="text-warning"
                            role="button"
                        />
                    </router-link>
                    <button
                        class="btn btn-dark btn-sm"
                        @click="logout"
                    >
                        Выход
                    </button>
                </div>
                <div
                    v-else
                    class="col-sm-4 text-right"
                >
                    <router-link to="/register/">
                        Регистрация
                    </router-link>
                    <router-link to="/secure/">
                        Вход для авторов
                    </router-link>
                </div>
            </div>
        </client-only>
        <div class="logo col-sm-12 col-md-3 text-center">
            <nuxt-link :to="'/'">
                <img
                    class="img-fluid mb-3"
                    src="https://altertravel.ru/i/logo.png"
                    alt="Альтернативный путеводитель"
                >
            </nuxt-link>
        </div>
        <div class="header-menu col-sm-12 col-md-9 d-flex text-center justify-content-around">
            <Menu class="align-self-end " />
        </div>
    </div>
</template>

<script>
    import Menu from './Menu.vue';

    export default {
        components: { Menu },
        methods: {
            logout() {
                this.$auth.logout();
                this.$router.push('/');
            },
        },
    };
</script>

<style scoped>
  .header {
    padding-top: 5px;
    padding-bottom: 0;
  }

  .row {
    background: #ebf1f5;
  }

  .header-menu {
    color: #fff;
    font-size: 20px;
    line-height: 22px;
  }
</style>
