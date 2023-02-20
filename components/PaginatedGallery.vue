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
    <router-link
        :to="`/secure/${type}/create`"
        class="d-inline-block mr-1 mt-1"
        :title="`Добавить ${name}`"
    >
        <font-awesome-icon
            icon="fa-plus-circle"
            class="text-success"
            role="button"
        />
        Добавить {{ name }}
    </router-link>
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
            name: {
                type: String,
                required: false,
                default: '',
            },
        },
        data() {
            return {
                page: 1,
            };
        },
        computed: {
            items: this.$store.getters[`${this.type}Paginated/items`],
            meta: this.$store.getters[`${this.type}Paginated/meta`],
            loading: this.$store.getters[`${this.type}Paginated/loading`],
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
                setParams(data) { this.$store.dispatch(`${this.type}Paginated/setParams`, data); },
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
