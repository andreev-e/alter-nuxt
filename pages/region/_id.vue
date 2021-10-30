<template>
  <div class="container page">
    <Header />
    <Breadcrumbs :list="tag.locations" :loading="loadingRegion" />
    <div class="row">
      <div class="col-sm-12">
        <h1>
          <img v-if="tag.flag" width="16" height="16" :src="`https://altertravel.ru/i/flags/` + tag.flag" alt="flag">
          {{ tag.name }}
          <b-spinner v-if="loadingRegion" />
        </h1>
      </div>
    </div>
    <TwoPanels :left="tag.children" :right="[]" />
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
    <Footer />
  </div>
</template>

<script>

export default {
  data () {
    return {
      pois: [],
      tag: {
        name: ''
      },
      page: 1,
      pages: null,
      perPage: 15,
      loadingPois: true,
      loadingRegion: true
    }
  },
  async fetch () {
    this.id = this.$route.params.id
    await this.fetchTagBackend()
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
  watch: {
    page: {
      handler (val) {
        this.fetchPoisBackend()
      }
    }
  },
  mounted () {
  },
  methods: {
    async fetchTagBackend () {
      const result = await this.$axios.$get('https://alter-api/tags/' + this.id)
      this.tag = result.tag
      this.loadingRegion = false
    },
    async fetchTag () {
      const result = await this.$axios.$get('https://alter-api/tags/' + this.id)
      this.tag = result.tag
    },
    async fetchPoisBackend () {
      this.loadingPois = true
      const { data, meta } = await this.$axios.$get(
        'https://alter-api/pois',
        { params: { tag: this.id, page: this.page } }
      )
      this.pois = data
      this.pages = meta.total
      this.loadingPois = false
    }
  }
}
</script>

<style>

</style>
