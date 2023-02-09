<!-- Please remove this file from your project -->
<template>
    <div class="header row">
        <div class="col-sm-12 d-flex justify-content-end">
            <div
                v-if="$auth.user"
                class="d-flex justify-content-between"
            >
                <nuxt-link
                    to="/secure"
                    class="d-inline-block mr-1 mt-1"
                >
                    {{ $auth.user.firstname }} {{ $auth.user.lastname }}
                </nuxt-link>
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
                <router-link to="/secure/">
                    Вход для авторов
                </router-link>
            </div>
        </div>
        <div class="logo col-sm-3">
            <nuxt-link :to="'/'">
                <img
                    src="https://altertravel.ru/i/logo.png"
                    alt="Альтернативный путеводитель"
                >
            </nuxt-link>
        </div>
        <div class="header-menu col-sm-9">
            <Menu />
        </div>
    </div>
</template>

<script>
    export default {
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
    padding: 10px 0;
  }

  .row {
    background: #ebf1f5;
  }

  .header-menu {
    color: #fff;
    font-size: 20px;
    margin-top: 30px;
    line-height: 22px;
  }
</style>
