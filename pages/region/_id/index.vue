<template>
    <div class="container page">
        <Header />
        <template v-if="tag">
            <Breadcrumbs
                :list="crumbs"
            />
            <div class="row">
                <div class="col-sm-12">
                    <h1>
                        <country-flag
                            v-if="tag.code"
                            class="d-inline-block mr-1"
                            :country="tag.code"
                            size="normal"
                        />
                        {{ h1 }}
                    </h1>
                </div>
            </div>
            <!--            <TwoPanels-->
            <!--                v-if="tag.children?.length"-->
            <!--                :left="tag.children"-->
            <!--                :right="[]"-->
            <!--            />-->
            <div class="row nopadding">
                <MapFilter
                    v-model="categories"
                    @update="filterChanged"
                />
            </div>
            <Map
                ref="mapComponent"
                :center="center"
                :location="$route.params.id"
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
                        v-if="meta.last_page > 1"
                        v-model="page"
                        :total-rows="meta.total"
                        :per-page="meta.per_page"
                        aria-controls="my-table"
                    />
                </div>
            </div>
        </template>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'Index',
        data() {
            return {
                type: null,
                page: 1,
            };
        },
        fetch() {
            this.load();
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
            ...mapGetters({
                loadingPois: 'poisPaginated/loading',
                pois: 'poisPaginated/items',
                meta: 'poisPaginated/meta',
                tag: 'tag/model',
            }),

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
            page() {
                this.fetchPois();
            },
        },
        methods: {
            ...mapActions({
                getPoi: 'poisPaginated/get',
                setPoiParams: 'poisPaginated/setParams',
                setId: 'tag/setId',
                getTag: 'tag/get',
            }),
            load() {
                this.setId(this.$route.params.id);
                this.getTag();
                this.type = this.$route.params.type;
                this.fetchPois();
            },
            fetchPois() {
                this.setPoiParams({
                    location: this.$route.params.id,
                    categories: this.categories,
                    page: this.page,
                });
                this.getPoi();
            },
            filterChanged(val) {
                if (this.$refs.mapComponent.$refs.map?.$mapObject) {
                    this.$refs.mapComponent.fetchPois(val);
                }
            },
        },
    };
</script>

<style>

</style>
