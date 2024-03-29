<template>
    <div class="row nopadding">
        <gmap-map
            ref="map"
            :center="computedCenter"
            :zoom="zoom"
            map-type-id="terrain"
            @dragend="userManipulates"
            @zoom_changed="userManipulates"
        >
            <gmap-marker
                v-if="myLocation"
                :position="myLocation"
                :icon="myLocationMarker"
            />
            <gmap-marker
                v-if="thisIsPoi"
                :position="center"
            />
            <gmap-polyline
                v-if="route && route.encoded_route"
                ref="polyline"
                :path="path"
                :options="{ strokeColor: '#FF0000' }"
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
            <gmap-marker
                v-if="start"
                :position="start"
                :icon="iconStart"
            />
            <gmap-marker
                v-if="finish"
                :position="finish"
                :icon="iconFinish"
            />
            <gmap-marker
                v-for="poi in mapPois"
                :key="`poi_`+poi.id"
                :position="{ lat: poi.lat, lng: poi.lng }"
                clickable
                :title="poi.name"
                :icon="getIcon(poi.type)"
                @click="$router.push('/poi/' + poi.id)"
            />
        </gmap-map>
    </div>
</template>

<script>
    import { gmapApi } from 'vue2-google-maps';
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
                myLocation: false,
                directionsLength: null,
                myLocationMarker: {
                    url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
                    size: {
                        width: 32,
                        height: 32,
                        f: 'px',
                        b: 'px',
                    },
                    scaledSize: {
                        width: 32,
                        height: 32,
                        f: 'px',
                        b: 'px',
                    },
                },
                iconStart: {
                    url: '/start.png',
                },
                iconFinish: {
                    url: '/end.png',
                },
            };
        },
        computed: {
            ...mapGetters({
                poiLoading: 'pois/loading',
                pois: 'pois/items',
                poisExist: 'pois/itemsExist',
            }),
            google: gmapApi,
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
                if (this.fitContent && this.bounds) {
                    return this.bounds.getCenter();
                }
                if (this.center) {
                    return this.center;
                }
                return {
                    lat: 55,
                    lng: 45,
                };
            },
            bounds() {
                if (this.google && this.route) {
                    let bounds = new this.google.maps.LatLngBounds();
                    // eslint-disable-next-line no-return-assign
                    this.path.forEach((point) => bounds = bounds.extend(point));
                    if (this.mapPois) {
                        // eslint-disable-next-line no-return-assign
                        this.mapPois.forEach((poi) => bounds = bounds.extend({
                            lat: poi.lat,
                            lng: poi.lng,
                        }));
                    }
                    return bounds;
                }
                return null;
            },
            path() {
                if (this.google && this.route && this.route.encoded_route) {
                    return this.google.maps.geometry.encoding
                        .decodePath(this.route.encoded_route);
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
                if (process.client && this.google && this.route && this.route.encoded_route) {
                    return `${Math.round(this.google.maps.geometry.spherical.computeLength(this.path) / 1000)}`;
                }
                return null;
            },
            waypoints() {
                if (process.client && this.mapPois && this.mapPois.length > 0) {
                    return this.mapPois.slice(0, 8)
                        .map((poi) => ({
                            location: {
                                lat: poi.lat,
                                lng: poi.lng,
                            },
                            stopover: true,
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
        },
        mounted() {
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
                    const bounds = this.$refs.map && this.$refs.map.$mapObject && this.$refs.map.$mapObject.getBounds();

                    if (bounds) {
                        params = {
                            ...params,
                            ...bounds.toJSON(),
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
            userManipulates() {
                if (this.rememberPosition) {
                    this.$auth.$storage.setLocalStorage(`position:${this.rememberPosition}`, this.$refs.map.$mapObject.getCenter());
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
    .vue-map-container {
        height: 500px;
        width: 100%;
    }

    .row.nopadding {
        position: relative;
    }
</style>
