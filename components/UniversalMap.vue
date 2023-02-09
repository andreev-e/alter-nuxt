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
                :center="center"
                :zoom="zoom"
                map-type-id="terrain"
                @dragend="fetchPois"
                @zoom_changed="zoomChanged"
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
                    v-if="line"
                    v-model="path"
                    :options="{ strokeColor:'#008000' }"
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
    import polyline from '@mapbox/polyline';
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { TYPES } from '../constants';

    export default {
        expose: ['fetchPois'],
        props: {
            model: { type: Array, default: () => [] },
            center: {
                type: Object,
                default: () => ({
                    lat: 55,
                    lng: 45,
                }),
            },
            tag: { type: String, default: null },
            location: { type: String, default: null },
            user: { type: String, default: null },
            categories: { type: Array, default: () => [] },
            zoom: { type: Number, default: 12 },
            thisIsPoi: { type: Boolean, default: false },
            route: { type: Number, default: null },
            start: { type: [Boolean, Object], default: false },
            finish: { type: [Boolean, Object], default: false },
            line: { type: String, default: null },
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
                return this.pois;
            },
            path() {
                return this.line ? polyline.decode(this.line, 5) : null;
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
                if (!this.poisExist) {
                    this.fetchPois();
                }
            },
            fetchPois(categories = null) {
                if (!this.thisIsPoi) {
                    const bounds = this.$refs.map.$mapObject.getBounds();
                    if (bounds) {
                        this.setParams({
                            tag: this.tag,
                            location: this.location,
                            ...bounds.toJSON(),
                            categories: categories ?? this.categories,
                            user: this.user,
                            route: this.route,
                        });
                        this.getPoi();
                    }
                }
            },
            zoomChanged() {
                this.fetchPois();
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
                    path: (type ? Icons[type.icon] : Icons.faCircleExclamation)?.icon[4].toString(),
                    fillColor: type.color ?? '#FF0000',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    scale: 0.05,
                    strokeWeight: 1,
                };
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

  .spinner {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
</style>
