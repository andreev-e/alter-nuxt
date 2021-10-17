<template>
  <div class="container page">
    <Header />
    <Breadcrumbs :list="tag.locations" />
    <div class="row">
      <div class="col-sm-12">
        <h1>
          <img v-if="tag.flag" width="16" height="16" :src="`https://altertravel.ru/i/flags/` + tag.flag" alt="flag">
          {{ tag.name }}
        </h1>
      </div>
    </div>
    <TwoPanels :left="tag.children" :right="[]"/>
    <div class="row inner-gal gallery">
      <div v-for="poi in pois" :key="poi.id" class="col-sm-3">
        <PoiCard :poi="poi" />
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
      }
    }
  },
  async fetch () {
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
  mounted () {
  },
  methods: {
    async fetchTagBackend () {
      const result = await this.$axios.$get('https://alter-api/tags/' + this.$route.params.id)
      this.tag = result.tag
    },
    async fetchTag () {
      const result = await this.$axios.$get('https://alter-api/tags/' + this.$route.params.id)
      this.tag = result.tag
    },
    async fetchPoisBackend () {
      const result = await this.$axios.$get('https://alter-api/pois', { params: { tag: this.$route.params.id } })
      this.pois = result.data
    }
  }
}
</script>

<style>

</style>
