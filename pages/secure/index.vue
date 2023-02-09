<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Авторский раздел
                </h1>
                <Gallery
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
        components: { Breadcrumbs, Gallery },
        middleware: 'auth',
        data() {
            return {
                page: 1,
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
            }),
            mapCenter() {
                if (this.user.lat && this.user.lng) {
                    return { lat: this.user.lat, lng: this.user.lng };
                }
                return this.location;
            },
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
                    user: this.$auth.user.username,
                    page: this.page,
                });
                this.getPoi();
            },
        },
    };
</script>

<style>

</style>
