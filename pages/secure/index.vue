<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Авторский раздел
                </h1>
                <client-only>
                    <b-tabs>
                        <b-tab
                            title="Точки"
                            class="my-3"
                        >
                            <template v-if="pois.length">
                                <item-gallery
                                    :objects="pois"
                                    :loading="poiLoading"
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
                            </template>
                            <router-link
                                v-else
                                to="/secure/poi/create"
                                class="d-inline-block mr-1 mt-1"
                                title="Добавить достопримечательность"
                            >
                                <font-awesome-icon
                                    icon="fa-plus-circle"
                                    class="text-success"
                                    role="button"
                                />
                                Добавить достопримечательность
                            </router-link>
                        </b-tab>
                        <b-tab
                            title="Маршруты"
                            class="my-3"
                        >
                            <template v-if="routes.length">
                                <item-gallery
                                    :objects="routes"
                                    :loading="routesLoading"
                                    @reload="fetchRoutes"
                                />
                                <div class="row">
                                    <div class="col-12">
                                        <b-pagination
                                            v-if="routesMeta.last_page > 1"
                                            v-model="routesPage"
                                            :total-rows="routesMeta.total"
                                            :per-page="routesMeta.per_page"
                                            aria-controls="my-table"
                                        />
                                    </div>
                                </div>
                            </template>
                            <router-link
                                v-else
                                to="/secure/route/create"
                                class="d-inline-block mr-1 mt-1"
                                title="Добавить маршрут"
                            >
                                <font-awesome-icon
                                    icon="fa-plus-circle"
                                    class="text-success"
                                    role="button"
                                />
                                Добавить маршрут
                            </router-link>
                        </b-tab>
                    </b-tabs>
                </client-only>
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
        components: { ItemGallery, Breadcrumbs },
        middleware: 'auth',
        data() {
            return {
                page: 1,
                routesPage: 1,
                breadCrumbs: [
                    {
                        name: 'Авторский раздел',
                        url: '',
                    },
                ],
            };
        },
        head: {
            title: 'Авторский раздел',
        },
        computed: {
            ...mapGetters({
                poiLoading: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
                routesLoading: 'routesPaginated/loading',
                routes: 'routesPaginated/items',
                routesMeta: 'routesPaginated/meta',
            }),
        },
        watch: {
            page() {
                this.fetchPois();
            },
            routesPage() {
                this.fetchRoutes();
            },
        },
        mounted() {
            this.fetchPois();
            this.fetchRoutes();
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setParams: 'poisPaginated/setParams',
                clear: 'poisPaginated/clear',

                getRoutes: 'poisPaginated/get',
                setParamsRoutes: 'poisPaginated/setParams',
                clearRoutes: 'poisPaginated/clear',
            }),
            fetchPois() {
                this.clear();
                this.setParams({
                    user: this.$auth.user.username,
                    page: this.page,
                    latest: 1,
                    withHidden: 1,
                });
                this.getPoi();
            },
            fetchRoutes() {
                this.clearRoutes();
                this.setParamsRoutes({
                    user: this.$auth.user.username,
                    page: this.page,
                    latest: 1,
                    withHidden: 1,
                });
                this.getRoutes();
            },
        },
    };
</script>

<style>

</style>
