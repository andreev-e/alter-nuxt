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
    <div class="row">
      <GmapMap
        :center="{lat:10, lng:10}"
        :zoom="7"
        map-type-id="terrain"
      />
    </div>
    <Gallery :objects="pois.slice(0, 3)" :loading="loadingPois" />
    <Comments />
    <Footer />
  </div>
</template>
<script>
export default {
  data () {
    return {
      pois: [],
      loadingPois: true
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
  },
  methods: {
    async fetchPoisBackend () {
      this.loadingPois = true
      const { data } = await this.$axios.$get('https://alter-api/pois')
      this.pois = data
      this.loadingPois = false
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

  .vue-map-container {
    height: 400px;
    width: 100%;
  }
</style>
