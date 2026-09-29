<template>
    <div class="social-login">
        <div
            v-if="$route.query.social_error"
            class="alert alert-danger"
        >
            {{ $t('UI.SOCIAL_LOGIN_ERROR') }}
        </div>
        <p class="text-muted">
            {{ $t('UI.LOGIN_WITH') }}
        </p>
        <a
            v-for="provider in providers"
            :key="provider.code"
            :href="`/api/auth/${provider.code}/redirect`"
            :class="`btn social-login__btn social-login__btn--${provider.code}`"
        >
            {{ provider.name }}
        </a>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                providers: [
                    { code: 'vkontakte', name: 'ВКонтакте' },
                    { code: 'yandex', name: 'Яндекс' },
                    { code: 'google', name: 'Google' },
                ],
            };
        },
    };
</script>

<style scoped>
    .social-login {
        margin-top: 20px;
    }

    .social-login__btn {
        margin: 0 5px 10px;
        color: #fff;
    }

    .social-login__btn:hover {
        color: #fff;
        opacity: .85;
    }

    .social-login__btn--vkontakte {
        background: #0077ff;
    }

    .social-login__btn--yandex {
        background: #fc3f1d;
    }

    .social-login__btn--google {
        background: #4285f4;
    }
</style>
