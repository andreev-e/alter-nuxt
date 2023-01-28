<template>
    <div class="container page">
        <Header />
        <template v-if="tag">
            <Breadcrumbs
                :list="crumbs"
                :loading="loadingRegion"
            />
            <div class="row">
                <div class="col-sm-12">
                    <h1>
                        <b-spinner v-if="loadingRegion" />
                        <img
                            v-if="tag.flag"
                            width="16"
                            height="16"
                            :src="`https://altertravel.ru/i/flags/` + tag.flag"
                            alt="flag"
                        >
                        {{ h1 }}
                    </h1>
                </div>
            </div>
            <TwoPanels
                v-if="tag.children.length"
                :left="tag.children"
                :right="[]"
            />
            <Map
                :center="center"
                :location="id"
                :categories="categories"
                :zoom="tag.zoom"
            />
            <Gallery
                :objects="pois"
                :loading="loadingPois"
            />
            <div class="row">
                <div class="col-12">
                    <b-pagination
                        v-if="pages > 1"
                        v-model="page"
                        :total-rows="pages"
                        :per-page="perPage"
                        aria-controls="my-table"
                    />
                </div>
            </div>
        </template>
        <Footer />
    </div>
</template>

<script>
    export default {
        name: 'Index',
        data() {
            return {
                id: null,
                pois: [],
                type: null,
                tag: {
                    name: '',
                    children: [],
                },
                page: 1,
                pages: null,
                perPage: 12,
                loadingPois: true,
                loadingRegion: true,
            };
        },
        async fetch() {
            this.id = this.$route.params.id;
            this.type = this.$route.params.type;
            await this.fetchTagBackend();
            await this.fetchPois();
        },
        head: {
            title: 'Карта достопримечательностей для самостоятельных путешественников',
            meta: [
                {
                    name: 'description',
                    content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!',
                },
            ],
        },
        computed: {
            h1() {
                if (this.type) {
                    if (this.tag.NAME_ROD_ED) {
                        return `${this.type} ${this.tag.NAME_ROD_ED}`;
                    }
                    return `${this.type}: ${this.tag.name}`;
                }
                return this.tag.name;
            },
            crumbs() {
                const crumbs = [...this.tag.parents ?? []];
                if (this.type) {
                    crumbs.push({
                        name: this.tag.name,
                        url: this.tag.url,
                    });
                    crumbs.push({
                        name: this.type,
                        url: '',
                    });
                } else {
                    crumbs.push({
                        name: this.tag.name,
                        url: '',
                    });
                }
                return crumbs;
            },
            categories() {
                return this.type ? [this.type] : null;
            },
            center() {
                if (this.tag) {
                    return {
                        lat: this.tag.lat,
                        lng: this.tag.lng,
                    };
                }
                return null;
            },
        },
        watch: {
            page: {
                handler() {
                    this.fetchPois();
                },
            },
        },
        methods: {
            async fetchTagBackend() {
                const result = await this.$axios.$get(`/tag/${this.id}`);
                this.tag = result.data;
                this.loadingRegion = false;
            },
            async fetchTag() {
                const result = await this.$axios.$get(`/tag/${this.id}`);
                this.tag = result.data;
            },
            async fetchPois() {
                this.loadingPois = true;
                const {
                    data,
                    meta,
                } = await this.$axios.$get(
                    '/poi',
                    {
                        params: {
                            location: this.id,
                            categories: this.categories,
                            page: this.page,
                            perPage: this.perPage,
                        },
                    },
                );
                this.pois = data;
                this.pages = meta.last_page;
                this.loadingPois = false;
            },
        },
    };
</script>

<style>

</style>
