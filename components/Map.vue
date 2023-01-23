<template>
  <div class="row nopadding">
    <div v-if="loading" class="spinner">
      <b-spinner />
    </div>
    <client-only>
      <gmap-map
        ref="map"
        :center="center"
        :zoom="7"
        map-type-id="hybrid"
        @dragend="fetchPoisToMap"
        @zoom_changed="fetchPoisToMap"
        @idle="fetchPoisToMap"
      >
        <gmap-marker
          v-if="mylocation"
          :position="mylocation"
          :clickable="true"
          :icon="mylocationMarker"
        />
        <gmap-marker
          v-for="poi in mappois"
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
  import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'
  import {
    faLeaf,
    faIndustry,
    faCircleExclamation,
    faBuildingFlag,
    faMuseum,
    faMonument,
    faSkull,
  } from '@fortawesome/free-solid-svg-icons'
  import MapFilter from '~/components/map/MapFilter.vue'

  export default {
    components: { MapFilter },
    expose: ['fetchPoisToMap'],
    props: {
      model: {
        type: Array,
        default: () => [],
      },
      center: {
        type: Object,
        default: () => {
          return {
            lat: 55,
            lng: 45,
          }
        },
      },
      tag: {
        type: String,
        default: null,
      },
      location: {
        type: String,
        default: null,
      },
      categories: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update'],
    data () {
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
        mappois: [],
        loading: false,
      }
    },
    computed: {
      google: gmapApi,
    },
    created () {
    },
    mounted () {
    },
    methods: {
      async fetchPoisToMap (categories = null) {
        if (!this.loading) {
          this.loading = true
          const bounds = this.$refs.map.$mapObject.getBounds()
          if (bounds) {
            const { data } = await this.$axios.$get(
              'https://api.altertravel.ru/api/poi',
              {
                params: {
                  tag: this.tag,
                  location: this.location, ...bounds.toJSON(),
                  categories: categories ?? this.categories,
                },
              },
            )
            this.mappois = data
            this.$emit('update', this.mappois)
          }
          this.loading = false
        }
      },
      getIcon (type) {
        let color = {}
        switch (type) {
          case 'Природа':
            color = {
              path: faLeaf.icon[4].toString(),
              fillColor: '#A7FC00',
            }
            break
          case 'Техноген':
            color = {
              path: faIndustry.icon[4].toString(),
              fillColor: '#64400F',
            }
            break
          case 'Архитектура':
            color = {
              path: faBuildingFlag.icon[4].toString(),
              fillColor: '#256D7B',
            }
            break
          case 'История-Культура':
            color = {
              path: faSkull.icon[4].toString(),
              fillColor: '#FFCF48',
            }
            break
          case 'Музей':
            color = {
              path: faMuseum.icon[4].toString(),
              fillColor: '#702963',
            }
            break
          case 'Памятник':
            color = {
              path: faMonument.icon[4].toString(),
              fillColor: '#F64A46',
            }
            break
          default:
            console.log(type)
        }
        return {
          path: faCircleExclamation.icon[4].toString(),
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          scale: 0.05,
          strokeWeight: 1,
          ...color,
        }
      },
    },
  }
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
