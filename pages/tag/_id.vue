<template>
  <div class="container page">
    <Header />
    <Breadcrumbs :list="[{name: $route.params.id, url: '' }]" :loading="loadingTag" />
    <div class="row">
      <div class="col-sm-12">
        <h1>
          {{ $route.params.id }}
        </h1>
      </div>
    </div>
    <Map :center="center" :tag="$route.params.id"/>
    <Gallery :objects="pois" :loading="loadingPois" />
    <div class="row">
      <div class="col-12">
        <b-pagination
          v-if="pages > 0"
          v-model="page"
          :total-rows="pages"
          :per-page="perPage"
          aria-controls="my-table"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Карта достопримечательностей для самостоятельных путешественников',
    meta: [
      {
        name: 'description',
        content: 'Каталог достопримечательностей на карте . Для самостоятельной организации путешествия!'
      }
    ]
  },
  data () {
    return {
      loadingTag: true,
      pois: [],
      loadingPois: true,
      center: {},
      page: 1,
      pages: null,
      perPage: 12
    }
  },
  async fetch () {
    this.id = this.$route.params.id
    await this.fetchPois()
  },
  watch: {
    page: {
      handler (val) {
        this.fetchPois()
      }
    }
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
    }
  },
  methods: {
    async fetchPois () {
      this.loadingPois = true
      const { data, meta } = await this.$axios.$get(
        'https://api.altertravel.ru/api/poi',
        { params: { tag: this.id, page: this.page, perPage: this.perPage } }
      )
      this.pois = data
      this.pages = meta.total
      this.loadingPois = false
    }
  }
}
</script>
