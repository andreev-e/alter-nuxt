<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Избранное
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <client-only>
                    <item-gallery
                        :objects="pois"
                        :loading="loadingPois"
                    />
                </client-only>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import ItemGallery from '../../../components/ItemGallery.vue';

    export default {
        components: { ItemGallery, Breadcrumbs },
        middleware: 'auth',
        data() {
            return {
                breadCrumbs: [
                    {
                        name: 'Авторский раздел',
                        url: '',
                    },
                ],
                page: 1,
            };
        },
        async fetch() {
            await this.fetchPois();
        },
        head: {
            title: 'Избранное',
        },
        computed: {
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
            }),
        },
        watch: {
            page() {
                this.fetchPois();
            },
        },
        methods: {
            ...mapActions({
                getPois: 'poisPaginated/get',
                clearPois: 'poisPaginated/clear',
                setParams: 'poisPaginated/setParams',
            }),
            async fetchPois() {
                if (this.$auth.user.favorites.length) {
                    await this.setParams({
                        list: this.$auth.user.favorites,
                        page: this.page,
                    });
                    await this.getPois();
                    return;
                }
                this.clearPois();
            },
        },
    };
</script>

<style>

</style>
