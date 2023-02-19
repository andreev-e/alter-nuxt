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
        <div class="row">
            <div class="col-12">
                <h2>Фото</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <photo-form
                    :images="user.image"
                    :path="`user/${$route.params.id}`"
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
    import PhotoForm from '../../../components/forms/PhotoForm.vue';

    export default {
        components: {
            PhotoForm,
            UserForm,
            Breadcrumbs,
        },
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
            await this.fetchUser();
        },
        computed: {
            ...mapGetters({
                user: 'user/model',
            }),
        },
        mounted() {
            this.fetchUser();
        },
        methods: {
            ...mapActions({
                get: 'user/get',
                setId: 'user/setId',
            }),
            async fetchUser() {
                await this.setId(this.$route.params.id);
                await this.get();
            },
        },
    };
</script>

<style scoped>

</style>
