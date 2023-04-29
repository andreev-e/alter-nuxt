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
        <client-only>
            <universal-map
                ref="mapComponent"
                :center="center"
                :location="$route.params.region"
                :tag="!isCategory ? $route.params.tag : null"
                :categories="isCategory ? [$route.params.tag] : categories"
                :zoom="location.zoom"
            />
        </client-only>
        <item-gallery
            ref="top"
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
    import pagination from '../../../mixins/pagination';

    export default {
        name: 'Index',
        components: {
            ItemGallery,
            UniversalMap,
            MapFilter,
            TwoPanels,
            Breadcrumbs,
        },
        mixins: [pagination],
        data() {
            return {
                page: 1,
                types: [...TYPES],
                categories: [],
            };
        },
        async fetch() {
            this.page = this.$route.query.p ? this.$route.query.p : 1;
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
                title: this.title,
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
            name() {
                return this.$i18n.locale === 'en' && this.location.name_en
                    ? this.location.name_en : this.location.name;
            },
            h1() {
                if (this.location && this.location.name_rod_ed && this.$i18n.locale !== 'en') {
                    return `${this.titleType} ${this.location.name_rod_ed}`;
                }
                return `${this.titleType}: ${this.name}`;
            },
            title() {
                if (this.$i18n.locale === 'en') {
                    return `${this.page > 1 ? `${this.$t('UI.PAGE')}. ${this.page}. ` : ''}${this.$route.params.tag ? `${this.titleType} of` : `Top ${this.pois.length > 10 ? 10 : this.pois.length} points of interest of`} ${this.name}. Route planning.`;
                }
                return `${this.page > 1 ? `${this.$t('UI.PAGE')}. ${this.page}. ` : ''}${this.$route.params.tag ? `${this.titleType}: ` : ''}${this.location.name_rod_ed ? 'Т' : `${this.location.name}: т`}оп ${this.pois.length > 10 ? 10 : this.pois.length} достопримечательностей ${this.location.name_rod_ed ? ` ${this.location.name_rod_ed}` : ''}. Планирование маршрута поездки.`;
            },
            description() {
                let result = '';
                if (this.location.name_dat_ed) {
                    result = `${this.titleType} ${this.$t('SEO.IN_THE_GUIDE_TO')} ${this.$i18n.locale !== 'en' ? this.location.name_dat_ed : this.name}.`;
                } else {
                    result = `${this.name} ${this.$t('SEO.IN_THE_GUIDE')}.`;
                }
                return `${result} ${this.$t('SEO.END_OF_DESCRIPTION')}`;
            },
            crumbs() {
                const crumbs = [...this.location.parents?.map((location) => ({
                    name: this.$i18n.locale === 'en' && location.name_en ? location.name_en : location.name,
                    url: `/region/${location.url}`,
                })) ?? []];
                if (this.$route.params.tag) {
                    crumbs.push({
                        name: this.name,
                        url: `/region/${this.location.url}`,
                    });
                    if (this.isCategory) {
                        crumbs.push({
                            name: this.$t(`CATEGORY.${this.$route.params.tag.toUpperCase()}`),
                            url: '',
                        });
                    } else {
                        crumbs.push({
                            name: this.$i18n.locale === 'en' ? this.tag.name_en : this.tag.name,
                            url: '',
                        });
                    }
                } else {
                    crumbs.push({
                        name: this.name,
                        url: '',
                    });
                }
                return crumbs;
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
                    case 'nature':
                        return this.$t('CATEGORY.NATURE_H1');
                    case 'architecture':
                        return this.$t('CATEGORY.ARCHITECTURE_H1');
                    case 'museum':
                        return this.$t('CATEGORY.MUSEUM_H1');
                    case 'monument':
                        return this.$t('CATEGORY.MONUMENT_H1');
                    case 'history_culture':
                        return this.$t('CATEGORY.HISTORY_CULTURE_H1');
                    case 'man_made':
                        return this.$t('CATEGORY.MAN_MADE_H1');
                    default:
                        return this.$t('POINTS_OF_INTEREST');
                    }
                }
                if (this.tag.name) {
                    if (this.$i18n.locale === 'en') {
                        return this.ucFirst(this.tag.name_en);
                    }
                    return this.ucFirst(this.tag.NAME_ROD ?? `${this.tag.name}:`);
                }
                return this.$t('POINTS_OF_INTEREST');
            },
        },
        mounted() {
            this.categories = this.$route.params.type ? [this.$route.params.type] : [...TYPES].map((t) => t.name);
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
                this.categories = val;
            },
            ucFirst(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
        },
    };
</script>

<style>

</style>
