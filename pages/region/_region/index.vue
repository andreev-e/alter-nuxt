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
    import UniversalMap from '../../../components/UniversalMap.vue';
    import Gallery from '../../../components/Gallery.vue';

    export default {
        name: 'Index',
        components: {
            Gallery, UniversalMap, MapFilter, TwoPanels, Breadcrumbs,
        },
        data() {
            return {
                type: null,
                page: 1,
            };
        },
        fetch() {
            this.load();
        },
        head: {
            title: 'Карта достопримечательностей для самостоятельных путешественников',
            meta: [
                {
                    name: 'description',
                    content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!',
                },
            ],
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
                if (this.$route.params.type && this.$route.params.tag) {
                    console.log('double');
                }
                if (this.type) {
                    if (this.tag.NAME_ROD_ED) {
                        return `${this.type} ${this.tag.NAME_ROD_ED}`;
                    }
                    return `${this.type}: ${this.tag.name}`;
                }
                return this.tag.name;
            },
            crumbs() {
                const crumbs = [...this.tag.parents ?? []];
                if (this.type) {
                    crumbs.push({
                        name: this.tag.name,
                        url: this.tag.url,
                    });
                    crumbs.push({
                        name: this.type,
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
                return { lat: 0, lng: 0 };
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
            load() {
                this.setId(this.$route.params.region);
                this.getTag();
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
