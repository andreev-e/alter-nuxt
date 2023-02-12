<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: 'Метка: '+tag.name, url: '' }]"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    {{ tag.name }}
                </h1>
            </div>
        </div>
        <universal-map
            ref="mapComponent"
            :center="center"
            :tag="$route.params.id"
            :zoom="zoom"
            @update="poisChanged"
        />
        <Gallery
            :objects="pois"
            :loading="loadingPois"
        />
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="meta.last_page > 1"
                    v-model="page"
                    :total-rows="meta.total"
                    :per-page="meta.per_page"
                    aria-controls="my-table"
                />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import Gallery from '../../components/Gallery.vue';
    import UniversalMap from '../../components/UniversalMap.vue';

    export default {
        components: {
            UniversalMap,
            Gallery,
            Breadcrumbs,
        },
        data() {
            return {
                loadingTag: true,
                center: { lat: 0, lng: 0 },
                page: 1,
                zoom: 12,
                reZoomInitialized: false,
            };
        },
        async fetch() {
            await this.fetchPois();
            await this.setId(this.$route.params.id);
            await this.getTag();
        },
        head: {
            title: 'Карта достопримечательностей для самостоятельных путешественников',
            meta: [
                {
                    name: 'description',
                    content: 'Каталог достопримечательностей на карте . Для самостоятельной организации путешествия!',
                },
            ],
        },
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
                tag: 'tag/model',
            }),
        },
        watch: {
            page() {
                this.fetchPois();
            },
        },
        mounted() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.center = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        this.mylocation = this.center;
                    },
                    () => {
                    },
                );
            }
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setParams: 'poisPaginated/setParams',
                setId: 'tag/setId',
                getTag: 'tag/get',
            }),
            async fetchPois() {
                this.setParams({
                    tag: this.$route.params.id,
                    page: this.page,
                });
                this.getPoi();
            },
            poisChanged(pois) {
                if (pois.length === 0
                    && this.$refs.mapComponent.$refs.map
                    && this.$refs.mapComponent.$refs.map.$mapObject
                ) {
                    this.zoom -= 2;
                }
            },
        },
    };
</script>

<style>

</style>
