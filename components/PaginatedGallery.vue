<template>
    <div>
        <item-gallery
            :objects="`${type}Items`"
            :loading="`${type}Loading`"
            @reload="fetchItems"
        />
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="`${type}Meta`.last_page > 1"
                    v-model="page"
                    :total-rows="`${type}Meta`.total"
                    :per-page="`${type}Meta`.per_page"
                    aria-controls="my-table"
                />
            </div>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import ItemGallery from './ItemGallery.vue';

    export default {
        name: 'PaginatedGallery',
        components: { ItemGallery },
        props: {
            type: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                page: 1,
            };
        },
        computed: {
            ...mapGetters({
                poiLoading: 'poiPaginated/loading',
                poiItems: 'poiPaginated/items',
                poiMeta: 'poiPaginated/meta',
                routesLoading: 'routesPaginated/loading',
                routesItems: 'routesPaginated/items',
                routesMeta: 'routesPaginated/meta',
            }),
        },
        watch: {
            page() {
                this.fetchItems();
            },
        },
        mounted() {
            this.fetchItems();
        },
        methods: {
            ...mapActions({
                get() { this.$store.dispatch(`${this.type}Paginated/get`); },
                setParams() { this.$store.dispatch(`${this.type}Paginated/setParams`); },
                clear() { this.$store.dispatch(`${this.type}Paginated/clear`); },
            }),
            fetchItems() {
                this.clear();
                this.setParams({
                    user: this.$auth.user.username,
                    page: this.page,
                    latest: 1,
                    withHidden: 1,
                });
                this.get();
            },
        },
    };
</script>

<style scoped>

</style>
