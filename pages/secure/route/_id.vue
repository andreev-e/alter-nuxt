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
                <poi-form :poi="poi" />
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
                    <route-form
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
    // eslint-disable-next-line import/extensions
    import { TYPES } from '../../../constants/index.js';
    import PoiForm from '../../../components/forms/PoiForm.vue';
    import RouteForm from '../../../components/forms/RouteForm.vue';

    export default {
        components: {
            RouteForm,
            PoiForm,
            Breadcrumbs,
        },
        middleware: 'auth',
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
        },
        head() {
            return {
                title: this.route.name,
            };
        },
        computed: {
            ...mapGetters({
                poi: 'route/model',
                loaded: 'route/isEmpty',
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
        methods: {
            ...mapActions({
                get: 'route/get',
                setId: 'route/setId',
                setProperty: 'route/setProperty',
            }),
            setImages(value) {
                this.setProperty({ property: 'images', value });
            },
        },
    };
</script>
