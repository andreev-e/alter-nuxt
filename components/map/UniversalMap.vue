<template>
    <div class="row nopadding">
        <div class="map-container">
            <mgl-map
                :center="computedCenter"
                :zoom="zoom"
                @ready="mapReady"
                @shown="fitToContent"
                @moveend="userManipulates"
            >
                <mgl-marker
                    v-if="thisIsPoi"
                    :lat-lng="center"
                />
                <mgl-polyline
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
                <mgl-marker
                    v-if="start"
                    :lat-lng="start"
                    :icon="iconStart"
                />
                <mgl-marker
                    v-if="finish"
                    :lat-lng="finish"
                    :icon="iconFinish"
                />
                <mgl-marker
                    v-for="poi in mapPois"
                    :key="`poi_`+poi.id"
                    :lat-lng="{ lat: poi.lat, lng: poi.lng }"
                    :title="poi.name"
                    :icon="getIcon(poi.type)"
                    @click="$router.push('/poi/' + poi.id)"
                />
            </mgl-map>
            <div
                v-if="poiLoading"
                class="map-loader"
            >
                <b-spinner small />
            </div>
        </div>
    </div>
</template>

<script>
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import DirectionsRenderer from './DirectionsRenderer.vue';
    import MglMap from './MglMap.vue';
    import MglMarker from './MglMarker.vue';
    import MglPolyline from './MglPolyline.vue';
    import map from '../../mixins/map';

    export default {
        expose: ['fetchPois'],
        components: {
            DirectionsRenderer, MglMap, MglMarker, MglPolyline,
        },
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
                        // Старые точки не стираем: они остаются на карте, пока грузятся новые
                        this.setParams(params);
                        this.getPoi();
                    } else {
                        setTimeout(() => {
                            this.fetchPois('await bounds');
                        }, 1000);
                    }
                }
            },
            getBoundsParams() {
                const { mapObject } = this;
                if (!mapObject || !mapObject.getContainer().clientWidth) {
                    return null;
                }
                const bounds = mapObject.getBounds();
                // При прокрутке через антимеридиан долгота выходит за [-180, 180]
                if (bounds.getEast() - bounds.getWest() >= 360) {
                    return {
                        south: bounds.getSouth(), west: -180, north: bounds.getNorth(), east: 180,
                    };
                }
                const wrap = (lng) => ((((lng + 180) % 360) + 360) % 360) - 180;
                return {
                    south: bounds.getSouth(),
                    west: wrap(bounds.getWest()),
                    north: bounds.getNorth(),
                    east: wrap(bounds.getEast()),
                };
            },
            mapReady(mapObject) {
                // Не в data, чтобы Vue не делал реактивным объект карты
                this.mapObject = mapObject;
                this.fitToContent();
            },
            fitToContent() {
                const { mapObject } = this;
                if (this.fitContent && mapObject && this.contentPoints.length) {
                    const bounds = new this.$maplibregl.LngLatBounds();
                    this.contentPoints.forEach(({ lat, lng }) => bounds.extend([lng, lat]));
                    mapObject.fitBounds(bounds, { padding: 20, duration: 0 });
                }
            },
            userManipulates() {
                if (this.rememberPosition) {
                    const { lat, lng } = this.mapObject.getCenter();
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
        cursor: pointer;
    }

    .map-poi-icon svg {
        display: block;
    }

    .map-loader {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        padding: 4px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.85);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        line-height: 1;
        pointer-events: none;
    }

    .row.nopadding {
        position: relative;
    }
</style>
