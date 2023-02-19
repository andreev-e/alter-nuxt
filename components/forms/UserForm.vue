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
                }, {
                    removeNullValues: false,
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
                let url = '/api/user';
                if (this.$route.params.id) {
                    url = `${url}/${this.$route.params.id}`;
                    this.form.addField('_method', 'PATCH');
                }

                this.form.submit(url)
                    .then((result) => {
                        if (this.$route.params.id) {
                            this.$router.push('/secure/');
                        } else {
                            this.$router.push(`/secure/user/${result.data.id}`);
                        }
                    });
            },
        },
    };
</script>

<style scoped>

</style>
