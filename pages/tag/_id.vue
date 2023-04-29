<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: `${$t('TAG')}: ${name ? name : ''} `, url: '' }]"
            :loading="loading"
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
        <client-only>
            <universal-map
                ref="mapComponent"
                :center="center"
                :tag="$route.params.id"
                :zoom="zoom"
                remember-position="index"
                @update="poisChanged"
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
                center: {
                    lat: 0,
                    lng: 0,
                },
                page: 1,
                zoom: 12,
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
                title: `${this.$t('UI.ALL')} ${this.nameRod} ${this.$t('SEO.IN_GUIDE_WITH')}. ${this.$t('POINTS_OF_INTEREST')}.`,
                meta: [
                    {
                        name: 'description',
                        content: `${this.$t('UI.ALL')} ${this.nameRod} ${this.$t('SEO.IN_GUIDE_WITH')}. ${this.$t('POINTS_OF_INTEREST')}.`,
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
            name() {
                return this.$i18n.locale === 'en' && this.tag.name_en ? this.tag.name_en : this.tag.name;
            },
            nameRod() {
                return this.$i18n.locale !== 'en' && this.tag.NAME_ROD ? this.tag.NAME_ROD : this.name;
            },
            h1() {
                if (this.tagLoaded) {
                    if (this.$i18n.locale === 'en') {
                        return `${this.name}: ${this.$t('SEO.POI_ON_MAP')}`;
                    }
                    return `${this.tag.NAME_ROD ? this.tag.NAME_ROD : this.tag.name}. ${this.$t('SEO.POI_ON_MAP')}`;
                }
                return null;
            },
        },
        watch: {
            page(p) {
                if (p) {
                    this.$router.push({ query: { p } });
                }
                if (process.client) {
                    this.$refs.top?.$el.scrollIntoView({ behavior: 'smooth' });
                }
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
                    // this.zoom -= 2;
                }
            },
        },
    };
</script>

<style>

</style>
