<!-- Please remove this file from your project -->
<template>
    <div class="header row">
        <client-only>
            <div class="user-panel mb-2 col-sm-12 d-flex justify-content-end">
                <div
                    v-if="$auth.loggedIn"
                    class="d-flex justify-content-between"
                >
                    <router-link
                        to="/secure/favorite"
                        class="d-inline-block mr-2 mt-1"
                        title="Избранное"
                    >
                        <font-awesome-icon
                            v-if="$auth.user.favorites && $auth.user.favorites.length"
                            icon="fa-star"
                            role="button"
                            class="text-warning"
                        />
                    </router-link>
                    <router-link
                        to="/secure/poi/create"
                        class="d-inline-block mr-2 mt-1"
                        title="Добавить достопримечательность"
                    >
                        <font-awesome-icon
                            icon="fa-location-pin"
                            class="text-primary"
                            role="button"
                        />
                    </router-link>
                    <router-link
                        to="/secure/route/create"
                        class="d-inline-block mr-2 mt-1"
                        title="Добавить маршрут"
                    >
                        <font-awesome-icon
                            icon="fa-route"
                            class="text-primary"
                            role="button"
                        />
                    </router-link>
                    <nuxt-link
                        to="/secure"
                        class="d-inline-block mr-2 mt-1"
                    >
                        {{ $auth.user.firstname || $auth.user.lastname ? `${$auth.user.firstname}  ${$auth.user.lastname}` : $auth.user.username }}
                    </nuxt-link>
                    <router-link
                        :to="`/secure/user/${$auth.user.username}`"
                        class="d-inline-block mr-2 mt-1"
                        title="Профиль"
                    >
                        <font-awesome-icon
                            icon="fa-edit"
                            class="text-primary"
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
                    src="/logo.png"
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
        mounted() {
            if (process.client) {
                this.$auth.fetchUser();
            }
        },
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
    line-height: 22px;
  }

  .user-panel {
    font-size: 20px;
  }
</style>
