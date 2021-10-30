<template>
  <div class="row">
    <GmapMap
      :center="center"
      :zoom="8"
      style="width:100%;  height: 500px;"
      map-type-control="true"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.position"
        @click="center=m.position"
      />
    </GmapMap>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'

export default {
  name: 'GoogleMap',
  props: {
    markers: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      center: { lat: 55, lng: 45 },
      currentPlace: null,
      places: [],
      currentLocation: {}
    }
  },
  computed: {
    google: gmapApi
  },
  mounted () {
    this.fetchPois()
    this.geolocate()
  },
  methods: {
    geolocate () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.currentLocation = position
      })
    },
    async fetchPois () {
      // const bounds = getBounds()
      // const nelat = bounds.tc.i
      // const nelng = bounds.Hb.g
      // const swlat = bounds.tc.g
      // const swlng = bounds.Hb.i
      // const result = await this.$axios.$get('https://alter-api/pois', { params: { nelat, nelng, swlat, swlng } })
      // this.pois = result.data
    }
  }
}
</script>

<style>
  .vue-map-container {
    margin: -15px auto;
  }
</style>
