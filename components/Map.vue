<template>
  <div class="row nopadding">
    <client-only>
      <GmapMap
        :center="center"
        :zoom="7"
        map-type-id="terrain"
      >
        <GmapMarker
          v-if="mylocation"
          :position="mylocation"
          :clickable="true"
          :icon="mylocationMarker"
        />
      </GmapMap>
    </client-only>
  </div>
</template>

<script>
import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'

export default {
  prop: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      center: { lat: 55, lng: 45 },
      mylocation: false,
      mylocationMarker: {
        url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
        size: { width: 64, height: 64, f: 'px', b: 'px' },
        scaledSize: { width: 64, height: 64, f: 'px', b: 'px' }
      }
    }
  },
  computed: {
    google: gmapApi
  },
  created () {
  },
  mounted () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.mylocation = this.center
        },
        () => {
        }
      )
    } else {
      // Browser doesn't support Geolocation
    }
  }
}
</script>

<style>
  .vue-map-container {
    height: 400px;
    width: 100%;
  }
</style>
