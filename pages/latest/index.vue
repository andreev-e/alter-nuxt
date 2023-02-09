<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="crumbs"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Новое
                </h1>
            </div>
        </div>
        <Gallery
            :objects="pois"
            :loading="loadingPois"
        />
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="meta.last_page > 1"
                    v-model="page"
                    :total-rows="meta.total"
                    :per-page="meta.per_page"
                    aria-controls="my-table"
                />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Gallery from '../../components/Gallery.vue';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';

    export default {
        name: 'Index',
        components: {
            Gallery,
            Breadcrumbs,
        },
        data() {
            return {
                type: null,
                page: 1,
            };
        },
        async fetch() {
            await this.fetchPois();
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
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
            }),
            crumbs() {
                return [];
            },
        },
        watch: {
            page() {
                this.fetchPois();
            },
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setPoiParams: 'poisPaginated/setParams',
            }),
            async fetchPois() {
                await this.setPoiParams({
                    page: this.page,
                    latest: true,
                });
                await this.getPoi();
            },
        },
    };
</script>

<style>

</style>
