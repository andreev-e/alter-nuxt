<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>Редактирование маршрута</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <route-form
                    :route="route"
                />
            </div>
        </div>
        <template v-if="$route.params.id">
            <div class="row">
                <div class="col-12">
                    <h2>Фото</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <photo-form
                        :images="route.images"
                        :path="`route/${$route.params.id}`"
                        @images="setImages"
                    />
                </div>
            </div>
        </template>
        <Footer />
    </div>
</template>

<script>
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import RouteForm from '../../../components/forms/RouteForm.vue';
    import PhotoForm from '../../../components/forms/PhotoForm.vue';

    export default {
        components: {
            PhotoForm,
            RouteForm,
            Breadcrumbs,
        },
        middleware: 'auth',
        head() {
            return {
                title: 'Редактор маршрута',
            };
        },
        computed: {
            ...mapGetters({
                route: 'route/model',
                loading: 'route/loading',
                endpoint: 'route/endpoint',
            }),
            breadCrumbs() {
                return [
                    {
                        name: 'Авторский раздел',
                        url: '/secure/',
                    },
                    {
                        name: this.route.name ? `Редактирование: ${this.route.name}` : '',
                        url: '',
                    },
                ];
            },
        },
        created() {
            this.setId(this.$route.params.id);
            this.getRoute();
        },
        methods: {
            ...mapActions({
                getRoute: 'route/get',
                setId: 'route/setId',
                setProperty: 'route/setProperty',
            }),
            setImages(value) {
                this.setProperty({ property: 'images', value });
            },
        },
    };
</script>
