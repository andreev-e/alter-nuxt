<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <poi-form :poi="poi" />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { Form } from 'laravel-request-utils';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    // eslint-disable-next-line import/extensions
    import { TYPES } from '../../../constants/index.js';
    import PoiForm from '../../../components/forms/PoiForm.vue';

    export default {
        components: {
            PoiForm, Breadcrumbs,
        },
        middleware: 'auth',
        data() {
            return {
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
                }, {
                    removeNullValues: false,
                }),
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
        },
        head() {
            return {
                title: this.poi.name,
                meta: [
                    {
                        name: 'description',
                        content: 'todo',
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                poi: 'poi/model',
                loaded: 'poi/isEmpty',
                endpoint: 'poi/endpoint',
            }),
            center: {
                get() {
                    if (this.poi) {
                        return { lat: this.poi.lat, lng: this.poi.lng };
                    }
                    return { lat: 0, lng: 0 };
                },
                set(val) {
                    this.form.lat = val.lat;
                    this.form.lng = val.lng;
                },
            },
            types() {
                return TYPES;
            },
            breadCrumbs() {
                return [
                    {
                        name: 'Авторский раздел',
                        url: '/secure/',
                    },
                    {
                        name: this.poi.name ? `Редактирование: ${this.poi.name}` : '',
                        url: '',
                    },
                ];
            },
        },
        methods: {
            ...mapActions({
                get: 'poi/get',
                setId: 'poi/setId',
            }),
        },
    };
</script>
