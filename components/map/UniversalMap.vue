<template>
    <div class="row nopadding">
        <div class="map-container">
            <l-map
                ref="map"
                :center="computedCenter"
                :zoom="zoom"
                @ready="mapReady"
                @moveend="userManipulates"
            >
                <l-tile-layer
                    :url="tileUrl"
                    :attribution="tileAttribution"
                />
                <l-marker
                    v-if="thisIsPoi"
                    :lat-lng="center"
                />
                <l-polyline
                    v-if="route && route.encoded_route"
                    :lat-lngs="path"
                    color="#FF0000"
                />
                <directions-renderer
                    v-if="route && !route.encoded_route"
                    travel-mode="DRIVING"
                    :origin="start"
                    :waypoints="waypoints"
                    :optimize-waypoints="true"
                    :destination="finish"
                    @routeFound="routeFound"
                />
                <l-marker
                    v-if="start"
                    :lat-lng="start"
                    :icon="iconStart"
                />
                <l-marker
                    v-if="finish"
                    :lat-lng="finish"
                    :icon="iconFinish"
                />
                <l-marker
                    v-for="poi in mapPois"
                    :key="`poi_`+poi.id"
                    :lat-lng="{ lat: poi.lat, lng: poi.lng }"
                    :options="{ title: poi.name }"
                    :icon="getIcon(poi.type)"
                    @click="$router.push('/poi/' + poi.id)"
                />
            </l-map>
        </div>
    </div>
</template>

<script>
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import DirectionsRenderer from './DirectionsRenderer.vue';
    import map from '../../mixins/map';

    export default {
        expose: ['fetchPois'],
        components: { DirectionsRenderer },
        mixins: [map],
        props: {
            model: {
                type: Array,
                default: () => [],
            },
            center: {
                type: Object,
                default: null,
            },
            tag: {
                type: String,
                default: null,
            },
            location: {
                type: String,
                default: null,
            },
            user: {
                type: String,
                default: null,
            },
            categories: {
                type: Array,
                default: () => [],
            },
            zoom: {
                type: Number,
                default: 10,
            },
            thisIsPoi: {
                type: Boolean,
                default: false,
            },
            route: {
                type: Object,
                default: null,
            },
            fitContent: {
                type: Boolean,
                default: false,
            },
            rememberPosition: {
                type: String,
                default: null,
            },
        },
        emits: ['update'],
        data() {
            return {
                directionsLength: null,
            };
        },
        computed: {
            ...mapGetters({
                poiLoading: 'pois/loading',
                pois: 'pois/items',
                poisExist: 'pois/itemsExist',
            }),
            iconStart() {
                return this.getImageIcon('/start.png', [30, 21]);
            },
            iconFinish() {
                return this.getImageIcon('/end.png', [37, 21]);
            },
            mapPois() {
                if (this.route) {
                    return this.route.pois;
                }
                if (this.pois) {
                    return this.pois;
                }
                return [];
            },
            computedCenter() {
                if (this.rememberPosition && this.$auth.$storage.getLocalStorage(`position:${this.rememberPosition}`)) {
                    return this.$auth.$storage.getLocalStorage(`position:${this.rememberPosition}`);
                }
                if (this.center) {
                    return this.center;
                }
                return {
                    lat: 55,
                    lng: 45,
                };
            },
            contentPoints() {
                if (!this.route) {
                    return [];
                }
                return [
                    ...this.path,
                    ...this.mapPois.map((poi) => ({ lat: poi.lat, lng: poi.lng })),
                ];
            },
            path() {
                if (this.route && this.route.encoded_route) {
                    return this.decodePath(this.route.encoded_route);
                }
                return [];
            },
            start() {
                if (this.route && this.route.start) {
                    const start = this.route.start.split(';');
                    return {
                        lat: parseFloat(start[0]),
                        lng: parseFloat(start[1]),
                    };
                }
                if (this.route && this.route.encoded_route) {
                    return this.path[0];
                }
                return false;
            },
            finish() {
                if (this.route && this.route.finish) {
                    const finish = this.route.finish.split(';');
                    return {
                        lat: parseFloat(finish[0]),
                        lng: parseFloat(finish[1]),
                    };
                }
                if (this.route && this.route.encoded_route) {
                    return this.path[this.path.length - 1];
                }
                return false;
            },
            routeLength() {
                if (this.route && this.route.encoded_route) {
                    return `${Math.round(this.pathLength(this.path) / 1000)}`;
                }
                return null;
            },
            waypoints() {
                if (process.client && this.mapPois && this.mapPois.length > 0) {
                    return this.mapPois.slice(0, 8)
                        .map((poi) => ({
                            lat: poi.lat,
                            lng: poi.lng,
                        }));
                }
                return null;
            },
        },
        watch: {
            pois() {
                this.$emit('update', [...this.pois]);
            },
            routeLength() {
                this.$emit('update');
            },
            categories() {
                this.fetchPois('categories');
            },
            contentPoints() {
                this.fitToContent();
            },
        },
        mounted() {
            if (this.routeLength) {
                this.$emit('update');
            }
            this.fetchPois('mounted');
        },
        methods: {
            ...mapActions({
                getPoi: 'pois/get',
                setParams: 'pois/setParams',
                clear: 'pois/clear',
            }),
            getRouteLength() {
                return this.routeLength ?? this.directionsLength;
            },
            // eslint-disable-next-line no-unused-vars
            fetchPois(reason = null) {
                // console.log('fetchPois', reason);
                if (!this.thisIsPoi && !this.route && !this.user) {
                    let params = {
                        tag: this.tag,
                        location: this.location,
                        categories: this.categories,
                        user: this.user,
                        route: this.route ? this.route.id : null,
                    };
                    const bounds = this.getBoundsParams();

                    if (bounds) {
                        params = {
                            ...params,
                            ...bounds,
                        };
                        this.setParams(params);
                        this.clear();
                        this.getPoi();
                    } else {
                        setTimeout(() => {
                            this.fetchPois('await bounds');
                        }, 1000);
                    }
                }
            },
            getBoundsParams() {
                const mapObject = this.$refs.map && this.$refs.map.mapObject;
                if (!mapObject || !mapObject.getSize().x) {
                    return null;
                }
                const bounds = mapObject.getBounds();
                // Leaflet не нормализует долготу при прокрутке карты через антимеридиан
                if (bounds.getEast() - bounds.getWest() >= 360) {
                    return {
                        south: bounds.getSouth(), west: -180, north: bounds.getNorth(), east: 180,
                    };
                }
                const wrap = (lng) => this.$L.Util.wrapNum(lng, [-180, 180], true);
                return {
                    south: bounds.getSouth(),
                    west: wrap(bounds.getWest()),
                    north: bounds.getNorth(),
                    east: wrap(bounds.getEast()),
                };
            },
            mapReady(mapObject) {
                this.observeMapSize(mapObject, this.fitToContent);
                this.fitToContent();
            },
            fitToContent() {
                const mapObject = this.$refs.map && this.$refs.map.mapObject;
                if (this.fitContent && mapObject && this.contentPoints.length) {
                    mapObject.fitBounds(this.$L.latLngBounds(this.contentPoints), { padding: [20, 20] });
                }
            },
            userManipulates() {
                if (this.rememberPosition) {
                    const { lat, lng } = this.$refs.map.mapObject.getCenter();
                    this.$auth.$storage.setLocalStorage(`position:${this.rememberPosition}`, { lat, lng });
                }
                if (!this.fitContent) {
                    this.fetchPois('userManipulates');
                }
            },
            routeFound(val) {
                this.directionsLength = val;
                this.$emit('update');
            },
        },
    };
</script>

<style>
    .map-poi-icon {
        background: none;
        border: none;
    }

    .row.nopadding {
        position: relative;
    }
</style>
