<template>
  <div class="container page">
    <Header />
    <template v-if="tag">
      <Breadcrumbs :list="crumbs" :loading="loadingRegion" />
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
      <Map :center="{ lat: tag.lat, lng: tag.lng }" />
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
    </template>
    <Footer />
  </div>
</template>

<script>

  export default {
    data () {
      return {
        pois: [],
        tag: {
          name: '',
          children: [],
        },
        page: 1,
        pages: null,
        perPage: 12,
        loadingPois: true,
        loadingRegion: true,
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
          content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!',
        },
      ],
    },
    watch: {
      page: {
        handler (val) {
          this.fetchPoisBackend()
        },
      },
    },
    computed: {
      crumbs () {
        return [
          ...this.tag.parents ?? [],
          {
            name: this.tag.name,
            url: '',
          },
        ]
      },
    },
    mounted () {
    },
    methods: {
      async fetchTagBackend () {
        const result = await this.$axios.$get('https://api.altertravel.ru/api/tag/' + this.id)
        this.tag = result.data
        this.loadingRegion = false
      },
      async fetchTag () {
        const result = await this.$axios.$get('https://api.altertravel.ru/api/tag/' + this.id)
        this.tag = result.data
      },
      async fetchPoisBackend () {
        this.loadingPois = true
        const {
          data,
          meta,
        } = await this.$axios.$get(
          'https://api.altertravel.ru/api/poi',
          {
            params: {
              location: this.id,
              page: this.page,
              perPage: this.perPage,
            },
          },
        )
        this.pois = data
        this.pages = meta.last_page
        this.loadingPois = false
      },
    },
  }
</script>

<style>

</style>
