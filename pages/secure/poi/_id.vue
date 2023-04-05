<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>{{ $t('POI.EDIT') }}</h1>
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
                    <photo-form
                        :images="poi.images"
                        :path="`poi/${$route.params.id}`"
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
    import PhotoForm from '../../../components/forms/PhotoForm.vue';

    export default {
        components: {
            PhotoForm,
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
                title: `${this.poi.name}: ${this.$t('POI.EDIT')}`,
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
                setProperty: 'poi/setProperty',
            }),
            setImages(value) {
                this.setProperty({ property: 'images', value });
            },
        },
    };
</script>
