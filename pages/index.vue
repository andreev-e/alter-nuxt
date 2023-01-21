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
    <Map
      v-model="mapPois"
      :center="center"
    />
    {{ mapPois }}
    <Gallery :objects="mapPois.length ? mapPois : pois.slice(4)" :loading="loadingPois" />
    <Comments link-objects />
    <Footer />
  </div>
</template>
<script>

  export default {
    data () {
      return {
        pois: [],
        mapPois: [],
        loadingPois: true,
        center: {},
      }
    },
    async fetch () {
      await this.fetchPois()
    },
    head: {
      title: 'Карта достопримечательностей для самостоятельных путешественников',
      meta: [
        {
          name: 'description',
          content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!',
        },
      ],
    },
    watch: {
      mapPois(val) {
        console.log(val)
      }
    },
    mounted () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            this.mylocation = this.center
          },
          () => {
          },
        )
      }
      this.fetchPois()
    },
    methods: {
      async fetchPois () {
        this.loadingPois = true
        const { data } = await this.$axios.$get('https://api.altertravel.ru/api/poi')
        this.pois = data
        this.loadingPois = false
      },
    },
  }
</script>

<style>

  h1.view {
    background: url('/i/star_grey.png') no-repeat left top;
    padding-left: 35px;
    cursor: pointer;
  }
</style>
