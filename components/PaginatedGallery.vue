<template>
    <div ref="top">
        <item-gallery
            v-if="items.length"
            :objects="items"
            :loading="loading"
            :type="type"
            @reload="fetchItems"
        />
        <router-link
            v-else
            :to="`/secure/${type}/create`"
            class="d-inline-block mr-1 mt-1"
            :title="`${$t('UI.ADD')} ${name}`"
        >
            <font-awesome-icon
                icon="fa-plus-circle"
                class="text-success"
                role="button"
            />
            {{ $t('UI.ADD') }} {{ name }}
        </router-link>
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
            items() {
                return this.$store.getters[`${this.type}sPaginated/items`];
            },
            meta() {
                return this.$store.getters[`${this.type}sPaginated/meta`];
            },
            loading() {
                return this.$store.getters[`${this.type}sPaginated/loading`];
            },
        },
        watch: {
            page() {
                if (process.client) {
                    this.$refs.top?.$el.scrollIntoView({ behavior: 'smooth' });
                }
                this.fetchItems();
            },
        },
        mounted() {
            this.fetchItems();
        },
        methods: {
            ...mapActions({
                get() {
                    this.$store.dispatch(`${this.type}sPaginated/get`);
                },
                setParams() {
                    this.$store.dispatch(`${this.type}sPaginated/setParams`, {
                        user: this.$auth.user.username,
                        page: this.page,
                        latest: 1,
                        withHidden: 1,
                    });
                },
                clear() {
                    this.$store.dispatch(`${this.type}sPaginated/clear`);
                },
            }),
            fetchItems() {
                // this.clear();
                this.setParams();
                this.get();
            },
        },
    };
</script>

<style scoped>

</style>
