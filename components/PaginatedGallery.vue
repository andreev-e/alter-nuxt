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
                    v-if="meta.last_page > 1"
                    v-model="page"
                    :total-rows="meta.total"
                    :per-page="meta.per_page"
                    aria-controls="my-table"
                />
            </div>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions } from 'vuex';
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
            items() {
                return this.$store.getters[`${this.type}Paginated/items`];
            },
            meta() {
                return this.$store.getters[`${this.type}Paginated/meta`];
            },
            loading() {
                return this.$store.getters[`${this.type}Paginated/loading`];
            },
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
