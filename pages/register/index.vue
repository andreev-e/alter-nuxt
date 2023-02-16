<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Регистрация
                </h1>
                <form @submit.prevent="doLogin">
                    <text-input
                        id="email"
                        v-model="form.email"
                        label="Email"
                        :form="form"
                        required
                    />
                    <text-input
                        id="username"
                        v-model="form.username"
                        label="Имя пользователя"
                        :form="form"
                        required
                    />
                    <text-input
                        id="password"
                        v-model="form.password"
                        label="Пароль"
                        type="password"
                        :form="form"
                        required
                    />
                    <div>
                        <button
                            class="btn btn-success"
                            type="submit"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import { Form } from 'laravel-request-utils';
    import TextInput from '../../components/ui/TextInput.vue';

    export default {
        components: { TextInput },
        data() {
            return {
                email: null,
                password: null,
                username: null,
                form: new Form({
                    email: null,
                    password: null,
                    username: null,
                }),
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
                    // TODO axios
                    // await this.$auth
                    //     .loginWith('laravelSanctum', { data });
                } catch (res) {
                    console.log(res);
                }
            },
        },
    };
</script>

<style>

</style>
