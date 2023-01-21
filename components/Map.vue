<template>
  <div class="row nopadding">
    <div v-if="loading" class="spinner">
      <b-spinner />
    </div>
    <client-only>
      <GmapMap
        ref="map"
        :center="center"
        :zoom="7"
        map-type-id="terrain"
        @dragend="fetchPoisToMap"
        @zoom_changed="fetchPoisToMap"
        @idle="fetchPoisToMap"
      >
        <GmapMarker
          v-if="mylocation"
          :position="mylocation"
          :clickable="true"
          :icon="mylocationMarker"
        />
        <GmapMarker
          v-for="poi in mappois"
          :key="`poi_`+poi.id"
          :position="{ lat: poi.lat, lng: poi.lng }"
          :clickable="true"
          :icon="getMarker(poi.hovered)"
          @click="$router.push('/poi/' + poi.id)"
        />
      </GmapMap>
    </client-only>
  </div>
</template>

<script>
  import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'

  export default {
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
    },
    emits: ['update'],
    data () {
      return {
        mylocation: false,
        mylocationMarker: {
          url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
          size: {
            width: 64,
            height: 64,
            f: 'px',
            b: 'px',
          },
          scaledSize: {
            width: 64,
            height: 64,
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
      async fetchPoisToMap () {
        if (!this.loading) {
          this.loading = true
          const bounds = this.$refs.map.$mapObject.getBounds()
          if (bounds) {
            const { data } = await this.$axios.$get(
              'https://api.altertravel.ru/api/poi',
              { params: { tag: this.tag, ...bounds.toJSON() } },
            )
            this.mappois = data
            this.$emit('update', this.mappois)
          }
          this.loading = false
        }
      },
      getMarker(hovered) {
        return {
          url: hovered ? 'https://maps.google.com/mapfiles/kml/paddle/wht-circle.png' : 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png',
        }
      },
    },
  }
</script>

<style>
  .vue-map-container {
    height: 400px;
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
