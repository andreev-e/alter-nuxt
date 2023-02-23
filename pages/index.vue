<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Карта Альтернативного Путеводителя
                </h1>
            </div>
        </div>
        <div class="row nopadding">
            <MapFilter
                v-model="categories"
                @update="filterChanged"
            />
        </div>
        <universal-map
            ref="mapComponent"
            v-model="mapPois"
            :center="center"
        />
        <item-gallery
            :loading="loadingPois"
            :objects="mapPois.length ? mapPois : pois.slice(0,3)"
        />
        <Comments
            link-objects
            :last="4"
            type="poi"
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
                center: { lat: 0, lng: 0 },
                categories: [...TYPES],
            };
        },
        fetch() {
            this.getPoi();
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
                        this.mylocation = this.center;
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
                if (this.$refs.mapComponent.$refs.map?.$mapObject) {
                    this.$refs.mapComponent.fetchPois(val);
                }
            },
        },
    };
</script>
