<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Вход
                </h1>
                {{ $auth.user }}
                {{ $store.state.auth.user }}

                <form @submit.prevent="doLogin">
                    <div>
                        <label>Email</label>
                        <input
                            v-model="login.email"
                            type="text"
                        >
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            v-model="login.password"
                            type="text"
                        >
                    </div>
                    <div>
                        <button type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                login: {
                    email: '',
                    password: '',
                },
            };
        },
        mounted() {
        },
        methods: {
            async doLogin() {
                try {
                    const response = await this.$auth.loginWith('laravelSanctum', { data: this.login });
                    console.log(response);
                } catch (err) {
                    console.log(err);
                }
            },
        },
    };
</script>

<style>

</style>
