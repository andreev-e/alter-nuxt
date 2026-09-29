<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    {{ $t('UI.LOGIN') }}
                </h1>
                <form @submit.prevent="doLogin">
                    <text-input
                        id="email"
                        v-model="email"
                        label="Email"
                        required
                    />
                    <text-input
                        id="password"
                        v-model="password"
                        label="Password"
                        type="password"
                        required
                    />
                    <div>
                        <button
                            class="btn btn-success"
                            type="submit"
                        >
                            {{ $t('UI.LOG_IN') }}
                        </button>
                    </div>
                </form>
                <SocialLogin />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import TextInput from '../../components/ui/TextInput.vue';
    import SocialLogin from '../../components/user/SocialLogin.vue';

    export default {
        components: { TextInput, SocialLogin },
        data() {
            return {
                email: '',
                password: '',
            };
        },
        created() {
            if (this.$auth.user) {
                this.$router.push('/secure');
            }
        },
        mounted() {
            if (this.$route.query.social_login) {
                this.finishSocialLogin();
            }
        },
        methods: {
            async finishSocialLogin() {
                // The session is already authenticated by the social callback;
                // the auth module also needs the XSRF-TOKEN cookie and its
                // token marker (what login() sets) to trust it.
                try {
                    await this.$auth.request(this.$auth.strategy.options.endpoints.csrf);
                    await this.$auth.setUserToken(true);
                } catch (e) {
                    // handled below: the user stays logged out
                }
                if (!this.$auth.loggedIn) {
                    this.$router.replace({ query: { social_error: 1 } });
                    return;
                }
                // With watchLoggedIn the auth module redirects home by itself
                if (!this.$auth.options.watchLoggedIn) {
                    this.$auth.redirect('home');
                }
            },
            async doLogin() {
                try {
                    const data = { email: this.email, password: this.password };
                    await this.$auth
                        .loginWith('laravelSanctum', { data });
                } catch (res) {
                    // console.log(res);
                }
            },
        },
    };
</script>

<style>

</style>
