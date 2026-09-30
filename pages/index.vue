<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    {{ $t('ALTERTRAVEL_MAP') }}
                </h1>
            </div>
        </div>
        <div class="row nopadding">
            <map-filter
                v-model="categories"
                @update="filterChanged"
            />
        </div>
        <client-only>
            <universal-map
                ref="mapComponent"
                v-model="mapPois"
                :center="center"
                :categories="selectedCategories"
                remember-position="index"
            />
        </client-only>
        <item-gallery
            style="min-height: 455px;"
            :loading="loadingPois"
            :objects="mapPois.length ? mapPois : pois.slice(0,3)"
        />
        <Comments
            link-objects
            :last="4"
        />
        <Footer />
    </div>
</template>
<script>
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { TYPES } from '../constants';
    import UniversalMap from '../components/map/UniversalMap.vue';
    import MapFilter from '../components/map/MapFilter.vue';
    import Comments from '../components/Comments.vue';
    import ItemGallery from '../components/ItemGallery.vue';

    export default {
        components: {
            ItemGallery,
            Comments,
            MapFilter,
            UniversalMap,
        },
        data() {
            return {
                mapPois: [],
                center: {
                    lat: 0,
                    lng: 0,
                },
                categories: [...TYPES],
                selectedCategories: [],
            };
        },
        fetch() {
            this.getPoi();
        },
        head() {
            return this.$seo.head({
                title: this.$t('SEO.INDEX_TITLE'),
                description: this.$t('SEO.INDEX_DESCRIPTION'),
                jsonLd: [{
                    '@type': 'WebSite',
                    name: this.$t('ALTERTRAVEL'),
                    url: this.$seo.url('/'),
                }],
            });
        },
        computed: {
            ...mapGetters({
                loadingPois: 'pois/loading',
                pois: 'pois/items',
            }),
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
                getPoi: 'pois/get',
                setParams: 'pois/setParams',
            }),
            filterChanged(val) {
                this.selectedCategories = val;
            },
        },
    };
</script>
