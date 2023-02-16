<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Модерация
                </h1>
                <client-only>
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
                breadCrumbs: [
                    {
                        name: 'Модерация',
                        url: '',
                    },
                ],
            };
        },
        head: {
            title: 'Модерация',
        },
        computed: {
            ...mapGetters({
                poiLoading: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
            }),
        },
        watch: {
            page() {
                this.fetchPois();
            },
        },
        mounted() {
            this.fetchPois();
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setParams: 'poisPaginated/setParams',
                clear: 'poisPaginated/clear',
            }),
            fetchPois() {
                this.clear();
                this.setParams({
                    page: this.page,
                    latest: 1,
                    onlyHidden: 1,
                });
                this.getPoi();
            },
        },
    };
</script>

<style>

</style>
