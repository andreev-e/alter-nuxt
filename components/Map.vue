<template>
  <div class="row nopadding">
    <client-only>
      <GmapMap
        :center="center"
        :zoom="7"
        map-type-id="terrain"
      >
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
      center: { lat: 55, lng: 45 }
    }
  },
  computed: {
    google: gmapApi
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style>
  .vue-map-container {
    height: 400px;
    width: 100%;
  }
</style>
