<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="crumbs" />
        <div class="row">
            <div class="col-sm-12">
                <h1 class="view">
                    {{ route.name }}
                </h1>
                <bage
                    class="bg-warning"
                    :url="`/user/${route.author}`"
                >
                    {{ route.author }}
                </bage>
                <bage class="bg-primary text-white">
                    {{ route.days }} дней
                </bage>
                <bage class="bg-warning">
                    {{ route.cost }} рублей
                </bage>
                <bage class="bg-primary text-white">
                    391.6 км TODO
                </bage>
                <bage class="bg-warning">
                    Опубликовано - {{ route.date }}
                </bage>
                <bage class="bg-primary text-white">
                    Просмотров - {{ route.views }}
                </bage>
            </div>
        </div>
        <b-row>
            <div class="col-sm-12">
                <client-only>
                    <universal-map
                        :zoom="6"
                        :route="route"
                        fit-content
                    />
                </client-only>
            </div>
            <div class="col-sm-12">
                <template v-if="route.pois && route.pois.length">
                    <h2>В маршрут входят точки</h2>
                    <Gallery
                        :objects="route.pois"
                    />
                </template>
                <h2 id="interesting">
                    Описание
                </h2>
                <p v-html="route.description" />
                <h2
                    v-if="route.route"
                    id="route"
                >
                    Особенности
                </h2>
                <p v-html="route.route" />

                <h2
                    v-if="route.links"
                    id="links"
                >
                    Ссылки
                </h2>
                <p v-html="route.links" />
            </div>
            <div class="col-sm-12">
                <div
                    class="route_photoes"
                    style="height: auto !important;"
                >
                    <div
                        v-if="route.images"
                        class="route_photoes"
                    >
                        <h2>Фото</h2>
                        <preview
                            v-for="image in route.images"
                            :key="image.id"
                            :alt="route.name"
                            :url="image.preview"
                            :full="image.original"
                        />
                        <p>© Все права на опубликованные фотографии принадлежат автору публикации.</p>
                    </div>
                </div>
            </div>
        </b-row>
        <Comments
            :id="$route.params.id"
            type="route"
        />
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import Comments from '../../components/Comments.vue';
    import UniversalMap from '../../components/UniversalMap.vue';
    import Preview from '../../components/Preview.vue';
    import Gallery from '../../components/Gallery.vue';
    import Bage from '../../components/ui/Bage.vue';

    export default {
        components: {
            Bage,
            Gallery,
            Preview,
            UniversalMap,
            Comments,
            Breadcrumbs,
        },
        data() {
            return {
                page: 1,
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
        },
        head() {
            return {
                title: this.route.name,
                meta: [
                    {
                        name: 'description',
                        content: 'todo',
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                route: 'route/model',
                loaded: 'route/isEmpty',
            }),
            crumbs() {
                return [
                    {
                        name: 'Маршруты',
                        url: '/route',
                    },
                    {
                        name: this.route.name,
                    },
                ];
            },
        },
        methods: {
            ...mapActions({
                get: 'route/get',
                setId: 'route/setId',
            }),
        },
    };
</script>

<style scoped>

</style>
