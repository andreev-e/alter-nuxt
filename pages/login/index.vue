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
                        v-model="email"
                        label="Email"
                        @update="pp"
                    />
                    <text-input
                        v-model="password"
                        label="Пароль"
                        type="password"
                    />
                    <div>
                        <button
                            class="btn btn-success"
                            type="submit"
                        >
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
                    console.log(data);
                    await this.$auth
                        .loginWith('laravelSanctum', { data });
                } catch (err) {
                    console.log(err);
                }
            },
            pp(vla) {
                console.log(vla);
            },
        },
    };
</script>

<style>

</style>
