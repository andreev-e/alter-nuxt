<template>
    <form @submit.prevent="onSubmit">
        <text-input
            id="name"
            v-model="form.name"
            label="Название"
            :form="form"
            required
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
                    name: null,
                }, {
                    removeNullValues: false,
                }),
            };
        },
        watch: {
            user(user) {
                ['name']
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
