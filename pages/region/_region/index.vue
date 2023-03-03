<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="crumbs"
            :loading="tagLoading || locationLoading"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    <country-flag
                        v-if="location.code"
                        class="d-inline-block mr-1"
                        :country="location.code"
                        size="normal"
                    />
                    <template v-if="!tagLoading && !locationLoading">
                        {{ h1 }}
                    </template>
                    <b-spinner v-else />
                </h1>
            </div>
        </div>
        <TwoPanels
            v-if="location.children && !($route.params.tag && $route.params.region)"
            :left="location.children"
            :right="location.tags"
            :tag="location"
        />
        <div class="row nopadding">
            <MapFilter
                v-if="!isCategory"
                v-model="categories"
                @update="filterChanged"
            />
        </div>
        <universal-map
            ref="mapComponent"
            :center="center"
            :location="$route.params.region"
            :tag="!isCategory ? $route.params.tag : null"
            :categories="isCategory ? [$route.params.tag] : categories"
            :zoom="location.zoom"
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
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import TwoPanels from '../../../components/TwoPanels.vue';
    import MapFilter from '../../../components/map/MapFilter.vue';
    import UniversalMap from '../../../components/map/UniversalMap.vue';
    import ItemGallery from '../../../components/ItemGallery.vue';
    import { TYPES } from '../../../constants/index';

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
                page: 1,
                types: [...TYPES],
            };
        },
        async fetch() {
            try {
                await this.load();
            } catch (error) {
                this.$nuxt.context.error({
                    status: 404,
                    message: error.message,
                });
            }
        },
        head() {
            return {
                title: `${this.page > 1 ? `Стр. ${this.page}. ` : ''}${this.$route.params.tag ? `${this.titleType}: ` : ''}${this.location.name_rod_ed ? 'Т' : `${this.location.name}: т`}оп ${this.pois.length > 10 ? 10 : this.pois.length} достопримечательностей${this.location.name_rod_ed ? ` ${this.location.name_rod_ed}` : ''}. Планирование маршрута поездки.`,
                meta: [
                    {
                        name: 'description',
                        content: this.description,
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
                location: 'location/model',
                locationLoading: 'location/loading',
                tagLoading: 'tag/loading',
                locationLoaded: 'location/isEmpty',
                tag: 'tag/model',
                tagLoaded: 'tag/isEmpty',
            }),
            h1() {
                if (this.location && this.location.name_rod_ed) {
                    return `${this.titleType} ${this.location.name_rod_ed}`;
                }

                return `${this.titleType}: ${this.location.name}`;
            },
            description() {
                let result = '';
                if (this.location.name_predlozh_ed) {
                    result = `${this.titleType} в путеводителе по ${this.location.name_dat_ed}.`;
                } else {
                    result = `${this.location.name} в путеводителе.`;
                }
                return `${result} Фотографии мест, карты, отзывы`;
            },
            crumbs() {
                const crumbs = [...this.location.parents?.map((location) => ({
                    name: location.name,
                    url: `/region/${location.url}`,
                })) ?? []];
                if (this.$route.params.tag) {
                    crumbs.push({
                        name: this.location.name,
                        url: `/region/${this.location.url}`,
                    });
                    if (this.isCategory) {
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
                } else {
                    crumbs.push({
                        name: this.location.name,
                        url: '',
                    });
                }
                return crumbs;
            },
            categories() {
                return this.$route.params.type ? [this.$route.params.type] : null;
            },
            center() {
                if (this.locationLoaded) {
                    return {
                        lat: this.location.lat,
                        lng: this.location.lng,
                    };
                }
                return {
                    lat: 0,
                    lng: 0,
                };
            },
            isCategory() {
                return this.types.map((type) => type.name).includes(this.$route.params.tag);
            },
            titleType() {
                if (this.isCategory) {
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
                }
                if (this.tag.name) {
                    return this.tag.NAME_ROD ?? `${this.tag.name}:`;
                }
                return 'Достопримечательности';
            },
        },
        watch: {
            page(p) {
                if (p) {
                    this.$router.push({ query: { p } });
                }
                this.fetchPois();
            },
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setPoiParams: 'poisPaginated/setParams',
                setLocationId: 'location/setId',
                getLocation: 'location/get',
                setTagId: 'tag/setId',
                getTag: 'tag/get',
                clearTag: 'tag/clear',
            }),
            async load() {
                await this.clearTag();
                await this.setLocationId(this.$route.params.region);
                await this.getLocation();
                if (!this.isCategory) {
                    if (this.$route.params.tag) {
                        await this.setTagId(this.$route.params.tag);
                        await this.getTag();
                    }
                }
                await this.fetchPois();
            },
            async fetchPois() {
                await this.setPoiParams({
                    location: this.$route.params.region,
                    tag: !this.isCategory ? this.$route.params.tag : null,
                    categories: this.isCategory ? [this.$route.params.tag] : this.categories,
                    page: this.page,
                });
                await this.getPoi();
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
