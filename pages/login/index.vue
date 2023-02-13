<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Вход
                </h1>
                <form @submit.prevent="doLogin">
                    <text-input
                        id="email"
                        v-model="email"
                        label="Email"
                        :form="form"
                    />
                    <text-input
                        id="password"
                        v-model="password"
                        label="Пароль"
                        type="password"
                        :form="form"
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
                email: '',
                password: '',
                form: new Form({
                    name: null,
                    description: null,
                    route: null,
                    route_o: null,
                    addon: null,
                    lat: null,
                    lng: null,
                    type: null,
                    links: null,
                    tags: [],
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
                    const data = { email: this.email, password: this.password };
                    await this.$auth
                        .loginWith('laravelSanctum', { data });
                } catch (res) {
                    console.log(res);
                }
            },
        },
    };
</script>

<style>

</style>
