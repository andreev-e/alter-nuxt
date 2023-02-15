<template>
    <div class="row nopadding">
        <div
            v-if="poiLoading"
            class="spinner"
        >
            <b-spinner />
        </div>
        <client-only>
            <gmap-map
                ref="map"
                :center="computedCenter"
                :zoom="zoom"
                map-type-id="terrain"
                @dragend="userManipulates"
                @zoom_changed="userManipulates"
                @idle="idle"
            >
                <gmap-marker
                    v-if="mylocation"
                    :position="mylocation"
                    :icon="mylocationMarker"
                />
                <gmap-marker
                    v-if="thisIsPoi"
                    :position="center"
                />
                <gmap-polyline
                    v-if="route && route.encoded_route"
                    :path="path"
                    :options="{ strokeColor: '#FF0000' }"
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
        </client-only>
    </div>
</template>

<script>
    import * as Icons from '@fortawesome/free-solid-svg-icons';
    import { gmapApi } from 'vue2-google-maps';
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { TYPES } from '../constants';

    export default {
        expose: ['fetchPois'],
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
        },
        emits: ['update'],
        data() {
            return {
                mylocation: false,
                autoZoom: 12,
                mylocationMarker: {
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
                    path: Icons.faFlag.icon[4].toString(),
                    fillColor: '#000',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    scale: 0.05,
                    strokeWeight: 1,
                },
                iconFinish: {
                    path: Icons.faFlagCheckered.icon[4].toString(),
                    fillColor: '#000',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    scale: 0.05,
                    strokeWeight: 1,
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
            types() {
                return TYPES;
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
                        this.mapPois.forEach((poi) => bounds = bounds.extend({ lat: poi.lat, lng: poi.lng }));
                    }
                    return bounds;
                }
                return null;
            },
            path() {
                if (this.route && this.route.encoded_route) {
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
                return false;
            },
        },
        watch: {
            pois() {
                this.$emit('update', [...this.pois]);
            },
        },
        mounted() {
            this.clear();
        },
        methods: {
            ...mapActions({
                getPoi: 'pois/get',
                setParams: 'pois/setParams',
                clear: 'pois/clear',
            }),
            idle() {
                if (!this.route && !this.poisExist) {
                    this.fetchPois();
                }
            },
            fetchPois(categories = null) {
                if (!this.thisIsPoi) {
                    let params = {
                        tag: this.tag,
                        location: this.location,
                        categories: categories ?? this.categories,
                        user: this.user,
                        route: this.route ? this.route.id : null,
                    };
                    const bounds = this.$refs.map.$mapObject.getBounds();
                    if (bounds && !this.route && !this.user) {
                        params = {
                            ...params,
                            ...bounds.toJSON(),
                        };
                    }
                    this.setParams(params);
                    this.getPoi();
                }
            },
            getTypeByName(name) {
                // eslint-disable-next-line consistent-return
                return this.types.reduce((acc, type) => {
                    if (type.name === name) {
                        return type;
                    }
                    return acc;
                });
            },
            getIcon(name) {
                const type = this.getTypeByName(name);
                return {
                    path: (type ? Icons[type.icon] : Icons.faCircleExclamation).icon[4].toString(),
                    fillColor: type.color ?? '#FF0000',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    scale: 0.05,
                    strokeWeight: 1,
                };
            },
            userManipulates() {
                if (!this.fitContent) {
                    this.fetchPois();
                }
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
