<template>
    <form @submit.prevent="onSubmit">
        <text-input
            id="firstname"
            v-model="form.firstname"
            label="Имя"
            :form="form"
        />
        <text-input
            id="lastname"
            v-model="form.lastname"
            label="Фамилия"
            :form="form"
        />
        <text-input
            id="about"
            v-model="form.about"
            label="Обо мне"
            :form="form"
        />
        <text-input
            id="homepage"
            v-model="form.homepage"
            label="Сайт https://"
            :form="form"
        />
        <text-input
            id="password"
            v-model="form.password"
            label="Пароль"
            :form="form"
            type="password"
        />
        <button
            type="submit"
            class="btn btn-success"
        >
            Сохранить
        </button>
    </form>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { Form } from 'laravel-request-utils';
    import TextInput from '../ui/TextInput.vue';

    export default {
        name: 'UserForm',
        components: {
            TextInput,
        },
        props: {
            user: {
                type: Object,
                required: false,
                default: () => {
                },
            },
        },
        data() {
            return {
                form: new Form({
                    firstname: null,
                    lastname: null,
                    about: null,
                    homepage: null,
                    password: null,
                }, {
                    removeNullValues: false,
                    resetAfterSend: false,
                    method: 'patch',
                }),
            };
        },
        watch: {
            user(user) {
                ['about', 'firstname', 'lastname', 'homepage']
                    .forEach((field) => {
                        this.form[field] = user[field];
                    });
            },
        },
        methods: {
            onSubmit() {
                this.form.submit(`/api/user/${this.$route.params.id}`)
                    .then(() => {
                        if (this.$auth.user.username === this.user.username) {
                            this.$auth.fetchUser();
                        } else {
                            this.$router.push('/user');
                        }
                    });
            },
        },
    };
</script>

<style scoped>

</style>
