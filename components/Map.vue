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
                    :clickable="true"
                    :icon="mylocationMarker"
                />
                <gmap-marker
                    v-for="poi in mapPois"
                    :key="`poi_`+poi.id"
                    :position="{ lat: poi.lat, lng: poi.lng }"
                    :clickable="true"
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
        },
        emits: ['update'],
        data() {
            return {
                mylocation: false,
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
            };
        },
        computed: {
            ...mapGetters({
                poiLoading: 'poi/loading',
                pois: 'poi/items',
                poisExist: 'poi/itemsExist',
            }),
            google: gmapApi,
            types() {
                return TYPES;
            },
            mapPois() {
                return this.pois;
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
                getPoi: 'poi/get',
                setParams: 'poi/setParams',
                clear: 'poi/clear',
            }),
            idle() {
                if (!this.poisExist) {
                    this.fetchPois();
                }
            },
            fetchPois(categories = null) {
                const bounds = this.$refs.map.$mapObject.getBounds();
                if (bounds) {
                    this.setParams({
                        tag: this.tag,
                        location: this.location,
                        ...bounds.toJSON(),
                        categories: categories ?? this.categories,
                        user: this.user,
                    });
                    this.getPoi();
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
