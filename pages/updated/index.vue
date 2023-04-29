<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="crumbs"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    {{ `${$t('UI.RECENTLY_UPDATED')} ${$t('POINTS_OF_INTEREST').toLowerCase()}` }}
                </h1>
            </div>
        </div>
        <item-gallery
            ref="top"
            :objects="pois"
            :loading="loadingPois"
            @reload="fetchPois"
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
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import ItemGallery from '../../components/ItemGallery.vue';
    import pagination from '../../mixins/pagination';

    export default {
        name: 'Index',
        components: {
            ItemGallery,
            Breadcrumbs,
        },
        mixins: [pagination],
        data() {
            return {
                type: null,
                page: 1,
            };
        },
        async fetch() {
            this.page = this.$route.query.p ? this.$route.query.p : 1;
            await this.fetchPois();
        },
        head() {
            return {
                title: `${this.$t('UI.RECENTLY_UPDATED')} ${this.$t('SEO.INDEX_TITLE').toLowerCase()}`,
                meta: [
                    {
                        name: 'description',
                        content: this.$t('SEO.INDEX_DESCRIPTION'),
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
            }),
            crumbs() {
                return [
                    {
                        name: this.$t('UI.RECENTLY_UPDATED'),
                        url: '',
                    },
                ];
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
                    updated: 1,
                });
                await this.getPoi();
            },
        },
    };
</script>

<style>

</style>
