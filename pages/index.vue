<template>
  <div class="container page">
    <Header />
    <div class="row">
      <div class="col-sm-12">
        <h1>
          Карта Альтернативного Путеводителя
        </h1>
      </div>
    </div>
    <client-only placeholder="Загрузка...">
      <GMap
        language="ru"
        :cluster="{options: {styles: clusterStyle}}"
        :center="{lat: 55.7522, lng: 37.6156}"
        :options="{fullscreenControl: false}"
        :zoom="8"
        @load="fetchPois"
        @dragend="fetchPois"
        @zoom_changed="fetchPois"
      >
        <GMapMarker
          v-for="poi in pois"
          :key="poi.id"
          :position="{lat: poi.lat, lng: poi.lng}"
          @click="$router.push('/poi/' + poi.id)"
        >
          <GMapInfoWindow :options="{maxWidth: 200}">
            <code>
              {{ poi.name }}
            </code>
          </GMapInfoWindow>
        </GMapMarker>
      </GMap>
    </client-only>
    <div class="row inner-gal gallery">
      <div v-for="poi in pois.slice(0, 6)" :key="poi.id" class="col-sm-2">
        <PoiCard :poi="poi" />
      </div>
    </div>
    <Comments />
    <Footer />
  </div>
</template>

<script>
export default {
  data () {
    return {
      pois: [],
      pins: {
        selected: '',
        notSelected: ''
      },
      clusterStyle: [
        {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 50,
          height: 50,
          textColor: '#fff'
        }
      ]
    }
  },
  async fetch () {
    await this.fetchPoisBackend()
  },
  head: {
    title: 'Карта достопримечательностей для самостоятельных путешественников',
    meta: [
      {
        name: 'description',
        content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!'
      }
    ]
  },
  loaded () {
    this.fetchPois()
  },
  methods: {
    async fetchPoisBackend () {
      const result = await this.$axios.$get('https://alter-api/pois')
      this.pois = result.data
    },
    async fetchPois ({ map }) {
      const bounds = map.getBounds()
      const nelat = bounds.tc.i
      const nelng = bounds.Hb.g
      const swlat = bounds.tc.g
      const swlng = bounds.Hb.i
      const result = await this.$axios.$get('https://alter-api/pois', { params: { nelat, nelng, swlat, swlng } })
      this.pois = result.data
    }
  }
}
</script>

<style>
  body {
      background-color: #606084;
      font-family: 'Roboto Condensed', sans-serif;
  }
  body a {
      color: #0D293C;
  }
  ul, li {
      list-style-type: none;
  }
  h1 {
      color: #244255;
      text-transform: uppercase;
      font-size: 1.6em;
  }
  h1.view {
      background: url(/i/star_grey.png) no-repeat left top;
      padding-left: 35px;
      cursor: pointer;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  .page>.row {
    padding: 15px 0;
  }
  .page>.row:nth-child(even) {
    background: #fff;
  }
  .page>.row:nth-child(odd) {
    background: #ebf1f5;
  }
  .page>.row:first-child {
    padding-bottom: 0;
  }
  .page {
        box-shadow: 0px 7px 20px 0px rgb(50 50 50 / 50%);
  }
  .GMap__InfoWindow {
    display:none;
  }
  .GMap {
    margin: 0 -15px;
    height: 400px;
  }
</style>
