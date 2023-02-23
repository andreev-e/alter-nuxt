<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: `Метка: ${tag.name??''} `, url: '' }]"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    <template v-if="h1">
                        {{ h1 }}
                    </template>
                    <b-spinner v-else />
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
        <item-gallery
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
    import UniversalMap from '../../components/map/UniversalMap.vue';
    import ItemGallery from '../../components/ItemGallery.vue';

    export default {
        components: {
            ItemGallery,
            UniversalMap,
            Breadcrumbs,
        },
        data() {
            return {
                center: { lat: 0, lng: 0 },
                page: 1,
                zoom: 12,
                reZoomInitialized: false,
            };
        },
        async fetch() {
            await this.load();
        },
        head() {
            return {
                title: `Все ${this.tag.NAME_ROD ? this.tag.NAME_ROD : this.tag.name} в путеводителе с фото, описаниями, отзывами, картами проезда. Достопримечательности.`,
                meta: [
                    {
                        name: 'description',
                        content: `Все ${this.tag.NAME_ROD ? this.tag.NAME_ROD : this.tag.name} в путеводителе с фото, описаниями, отзывами, картами проезда. Достопримечательности.`,
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
                tag: 'tag/model',
                loading: 'tag/loading',
                tagLoaded: 'tag/isEmpty',
            }),
            h1() {
                if (this.tagLoaded) {
                    return `${this.tag.NAME_ROD ? this.tag.NAME_ROD : this.tag.name}. Достопримечательности на карте`;
                }
                return null;
            },
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
                setTagId: 'tag/setId',
                getTag: 'tag/get',
            }),
            async load() {
                await this.setTagId(this.$route.params.id);
                await this.getTag();
                await this.fetchPois();
            },
            async fetchPois() {
                await this.setParams({
                    tag: this.$route.params.id,
                    page: this.page,
                });
                await this.getPoi();
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
