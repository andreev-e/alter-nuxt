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
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import TextInput from '../../components/ui/TextInput.vue';

    export default {
        components: { TextInput },
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
        methods: {
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
