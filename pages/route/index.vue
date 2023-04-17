<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="crumbs"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    {{ $t('ROUTE.ROUTES_AND_VOYAGES_WITH_DESСRIPTION') }}
                </h1>
            </div>
        </div>
        <item-gallery
            :objects="routes"
            :loading="loadingRoutes"
            type="route"
        />
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="meta.last_page > 1"
                    v-model="page"
                    :total-rows="meta.total"
                    :per-page="meta.per_page"
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

    export default {
        components: {
            ItemGallery,
            Breadcrumbs,
        },
        data() {
            return {
                crumbs: [
                    {
                        name: this.$t('ROUTE.ROUTES'),
                        to: '',
                    },
                ],
                page: 1,
            };
        },
        async fetch() {
            await this.load();
        },
        head() {
            return {
                title: this.$t('ROUTE.VOYAGES'),
                meta: [
                    {
                        name: 'description',
                        content: 'todo',
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                loadingRoutes: 'routesPaginated/loading',
                routes: 'routesPaginated/items',
                meta: 'routesPaginated/meta',
            }),
        },
        watch: {
            page() {
                this.load();
            },
        },
        methods: {
            ...mapActions({
                fetchRoutes: 'routesPaginated/get',
                setParams: 'routesPaginated/setParams',
            }),
            async load() {
                await this.setParams({
                    page: this.page,
                });
                await this.fetchRoutes();
            },
        },
    };
</script>

<style scoped>

</style>
