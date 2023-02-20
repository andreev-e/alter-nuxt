<template>
    <div>
        <item-gallery
            :objects="items"
            :loading="loading"
            @reload="fetchItems"
        />
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="meta?.last_page > 1"
                    v-model="page"
                    :total-rows="meta?.total"
                    :per-page="meta?.per_page"
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
            type: { type: String, required: true, default: 'pois' },
        },
        data() {
            return {
                page: 1,
            };
        },
        computed: {
            ...mapGetters({
                loading: `${this?.type}Paginated/loading`,
                items: `${this?.type}Paginated/items`,
                meta: `${this?.type}Paginated/meta`,
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
                get: `${this?.type}Paginated/get`,
                setParams: `${this?.type}Paginated/setParams`,
                clear: `${this?.type}Paginated/clear`,
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
