<!-- Please remove this file from your project -->
<template>
    <div class="header row">
        <client-only>
            <div class="user-panel col-sm-12 d-flex justify-content-center justify-content-md-end">
                <lang-switcher class="mr-3" />
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
                            icon="fa-map-marker"
                            class="text-success"
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
                            class="text-success"
                            role="button"
                        />
                    </router-link>
                    <nuxt-link
                        to="/secure"
                        class="d-inline-block mr-2 mt-1"
                    >
                        {{ $auth.user.firstname || $auth.user.lastname
                            ? `${$auth.user.firstname}  ${$auth.user.lastname}`
                            : $auth.user.username }}
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
                    <div class="d-inline-block mr-2 mt-1">
                        <font-awesome-icon
                            icon="fa-sign-out"
                            role="button"
                            @click="logout"
                        />
                    </div>
                </div>
                <div
                    v-else
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
            <main-menu class="align-self-end " />
        </div>
    </div>
</template>

<script>
    import MainMenu from './menu/MainMenu.vue';
    import LangSwitcher from './LangSwitcher.vue';

    export default {
        components: { LangSwitcher, MainMenu },
        mounted() {
            if (process.client && this.$auth.loggedIn) {
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

  @media only screen and (min-width: 992px) {
    .user-panel {
      margin-bottom: -20px;
      z-index: 10;
    }
  }

</style>
