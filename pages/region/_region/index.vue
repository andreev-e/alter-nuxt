<template>
    <div class="container page">
        <Header />
        <template v-if="tag">
            <Breadcrumbs
                :list="crumbs"
            />
            <div class="row">
                <div class="col-sm-12">
                    <h1>
                        <country-flag
                            v-if="tag.code"
                            class="d-inline-block mr-1"
                            :country="tag.code"
                            size="normal"
                        />
                        {{ h1 }}
                    </h1>
                </div>
            </div>
            <TwoPanels
                v-if="tag.children && !($route.params.tag && $route.params.region)"
                :left="tag.children"
                :right="tag.tags"
                :tag="tag"
            />
            <div class="row nopadding">
                <MapFilter
                    v-model="categories"
                    @update="filterChanged"
                />
            </div>
            <universal-map
                ref="mapComponent"
                :center="center"
                :location="$route.params.region"
                :tag="$route.params.tag"
                :categories="categories"
                :zoom="tag.zoom"
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
        </template>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import TwoPanels from '../../../components/TwoPanels.vue';
    import MapFilter from '../../../components/map/MapFilter.vue';
    import UniversalMap from '../../../components/map/UniversalMap.vue';
    import ItemGallery from '../../../components/ItemGallery.vue';

    export default {
        name: 'Index',
        components: {
            ItemGallery,
            UniversalMap,
            MapFilter,
            TwoPanels,
            Breadcrumbs,
        },
        data() {
            return {
                type: null,
                page: 1,
            };
        },
        async fetch() {
            await this.load();
        },
        head() {
            return {
                title: `${this.$route.params.tag ? `${this.$route.params.tag}: ` : ''}${this.tag.name_rod_ed ? 'Т' : `${this.tag.name}: т`}оп 10 достопримечательностей${this.tag.name_rod_ed ? ` ${this.tag.name_rod_ed}` : ''}. Планирование маршрута поездки.`,
                meta: [
                    {
                        name: 'description',
                        content: `${this.tag.name_predlozh_ed ? `${this.titleType} в путеводителе по ${this.tag.name_predlozh_ed}.`
                            : `${this.tag.name} в путеводителе.`} Фотографии мест, карты, отзывы`,
                    },
                ],
                link: [
                    {
                        rel: 'canonical',
                        href: `/region/${this.$route.params.region}${this.$route.params.tag ? `/${this.$route.params.tag}` : ''}`,
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
                tag: 'location/model',
                tagLoaded: 'location/isEmpty',
            }),
            h1() {
                if (this.tag.name_rod_ed) {
                    return `${this.titleType} ${this.tag.name_rod_ed}`;
                }

                return `${this.titleType}: ${this.tag.name}`;
            },
            crumbs() {
                const crumbs = [...this.tag.parents?.map((tag) => ({
                    name: tag.name,
                    url: `/region/${tag.url}`,
                })) ?? []];
                if (this.$route.params.tag) {
                    crumbs.push({
                        name: this.tag.name,
                        url: `/region/${this.tag.url}`,
                    });
                    crumbs.push({
                        name: this.$route.params.tag,
                        url: '',
                    });
                } else {
                    crumbs.push({
                        name: this.tag.name,
                        url: '',
                    });
                }
                return crumbs;
            },
            categories() {
                return this.type ? [this.type] : null;
            },
            center() {
                if (this.tagLoaded) {
                    return {
                        lat: this.tag.lat,
                        lng: this.tag.lng,
                    };
                }
                return {
                    lat: 0,
                    lng: 0,
                };
            },
            titleType() {
                switch (this.$route.params.tag) {
                case 'Природа':
                    return 'Природные достопримечательности';
                case 'Архитектура':
                    return 'Архитектурные достопримечательности';
                case 'Музей':
                    return 'Музеи';
                case 'Памятник':
                    return 'Памятники';
                case 'История-Культура':
                    return 'Исторические и культурные достопримечательности';
                case 'Техноген':
                    return 'Техногенные достопримечательности';
                default:
                    return 'Достопримечательности';
                }
            },
        },
        watch: {
            page() {
                this.fetchPois();
            },
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setPoiParams: 'poisPaginated/setParams',
                setId: 'location/setId',
                getTag: 'location/get',
            }),
            async load() {
                await this.setId(this.$route.params.region);
                await this.getTag();
                this.type = this.$route.params.type;
                this.fetchPois();
            },
            fetchPois() {
                this.setPoiParams({
                    location: this.$route.params.region,
                    tag: this.$route.params.tag,
                    categories: this.categories,
                    page: this.page,
                });
                this.getPoi();
            },
            filterChanged(val) {
                if (this.$refs.mapComponent.$refs.map?.$mapObject) {
                    this.$refs.mapComponent.fetchPois(val);
                }
            },
        },
    };
</script>

<style>

</style>
