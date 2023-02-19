<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>Редактирование пользователя</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <user-form
                    :user="user"
                />
            </div>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import UserForm from '../../../components/forms/UserForm.vue';

    export default {
        components: { UserForm, Breadcrumbs },
        middleware: 'auth',
        data() {
            return {
                breadCrumbs: [
                    {
                        name: 'Авторский раздел',
                        url: '/secure/',
                    },
                    {
                        name: `Редактирование: пользователя ${this.$route.params.id}`,
                        url: '',
                    },
                ],
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
        },
        computed: {
            ...mapGetters({
                user: 'user/model',
            }),
        },
        methods: {
            ...mapActions({
                get: 'user/get',
                setId: 'user/setId',
            }),
        },
    };
</script>

<style scoped>

</style>
