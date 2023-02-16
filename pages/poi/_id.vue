<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12">
                <h1 class="view">
                    {{ poi.name }}
                </h1>
                <bage
                    class="bg-warning"
                    :url="`/user/${poi.author}`"
                >
                    {{ poi.author }}
                </bage>
                <bage
                    v-for="tag in poi.tags"
                    :key="tag.id"
                    class="bg-primary"
                    :url="`/tag/${tag.url}`"
                >
                    {{ tag.name }}
                </bage>
                <bage class="bg-secondary text-white">
                    {{ poi.views }} просмотров{{ poi.views_month ? `, за месяц ${poi.views_month}` : '' }}{{ poi.views_today ? `, сегодня ${poi.views_today}` : '' }}
                </bage>
                <bage
                    v-if="poi.comments"
                    class="bg-light"
                >
                    {{ poi.comments }} отзыва
                </bage>
            </div>
        </div>
        <div class="row inner">
            <div class="col-sm-12 object-full">
                <b-tabs>
                    <b-tab title="Фото">
                        <photo-gallery
                            :alt="poi.name"
                            :images="poi.images"
                        />
                        <nuxt-link :to="`/user/${poi.author}`">
                            &copy; {{ poi.copyright ? poi.copyright : poi.author }}
                        </nuxt-link>
                    </b-tab>
                    <b-tab
                        v-if="poi.ytb"
                        title="Видео"
                    >
                        <iframe
                            width="700"
                            height="400"
                            :src="`https://www.youtube.com/embed/${poi.ytb}`"
                        />
                    </b-tab>
                    <b-tab title="Описание">
                        <div class="py-3">
                            <p>
                                {{ poi.description }}
                            </p>
                            <template
                                v-if="poi.route"
                            >
                                <h2

                                    id="route"
                                >
                                    Как добраться на машине
                                </h2>
                                <p>{{ poi.route }}</p>
                            </template>
                            <template
                                v-if="poi.route_o"
                            >
                                <h2

                                    id="route_o"
                                >
                                    Как добраться на общественном транспорте
                                </h2>
                                <p>{{ poi.route_o }}</p>
                            </template>
                            <template
                                v-if="poi.links"
                            >
                                <h2 id="links">
                                    Ссылки
                                </h2>
                                <p>
                                    {{ poi.links }}
                                </p>
                            </template>
                            <template
                                v-if="poi.addon"
                            >
                                <h2 id="addon">
                                    Примечание
                                </h2>
                                <p>{{ poi.addon }}</p>
                            </template>
                        </div>
                    </b-tab>
                    <b-tab
                        v-if="loaded && poi.routes.length"
                        title="Маршруты с точкой"
                    >
                        <div class="py-3">
                            <h2 id="near">
                                Маршруты
                            </h2>
                            <div class="near">
                                <item-gallery
                                    :objects="poi.routes"
                                    type="route"
                                />
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Где находится?">
                        <div class="py-3 px-3">
                            <client-only>
                                <universal-map
                                    v-if="loaded"
                                    :center="{ lat: poi.lat, lng: poi.lng }"
                                    :zoom="10"
                                    this-is-poi
                                />
                            </client-only>
                            <h2 id="coord">
                                Координаты
                            </h2>
                            <div class="row">
                                <div class="col-sm-3 coords plusplus_sl">
                                    <div class="qr">
                                        <img
                                            src="https://altertravel.ru/qr.php?lng=43.455948&amp;lat=43.123161"
                                            alt="QR code"
                                        >
                                    </div>
                                </div>
                                <div class="col-sm-3 coords plusplus_sl">
                                    <div class="points">
                                        <span>{{ poi.lat }},&nbsp;{{ poi.lng }}</span>
                                        <a href="https://altertravel.ru/generate_kml.php?id=22728">
                                            <div class="dwnl-kml">
                                                <span>скачать KML файл</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <nuxt-link
                                        to="/izbannoye"
                                        class="btn btn-dark mr-2"
                                    >
                                        Построить маршрут с данной точкой
                                    </nuxt-link>
                                    <a
                                        id="geo"
                                        class="btn btn-dark"
                                        :href="`https://maps.google.com/maps?daddr=${poi.lat},${poi.lng}&amp;ll=`"
                                    >Навигация на точку</a>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
        <div
            v-if="loaded"
            class="row"
        >
            <div class="col-sm-12">
                <h2 id="near">
                    Что еще есть рядом с эти местом
                </h2>
                <item-gallery
                    :objects="poi.nearest"
                />
            </div>
        </div>
        <Comments
            :id="$route.params.id"
            type="poi"
        />
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { TYPES } from '../../constants';
    import Comments from '../../components/Comments.vue';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import UniversalMap from '../../components/map/UniversalMap.vue';
    import Bage from '../../components/ui/Bage.vue';
    import PhotoGallery from '../../components/PhotoGallery.vue';
    import ItemGallery from '../../components/ItemGallery.vue';

    export default {
        components: {
            ItemGallery,
            PhotoGallery,
            Bage,
            UniversalMap,
            Breadcrumbs,
            Comments,
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
        },
        head() {
            return {
                title: this.poi.name,
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
                poi: 'poi/model',
                loaded: 'poi/isEmpty',
            }),
            types() {
                return TYPES;
            },
            breadCrumbs() {
                const breadCrumbs = [...this.poi.locations ?? []].map((location) => ({
                    name: location.name,
                    url: `/region/${location.url}`,
                }));
                if (this.poi && this.poi.locations && this.poi.locations.length) {
                    breadCrumbs.push({
                        name: this.poi.type,
                        url: `/region/${this.poi.locations[this.poi.locations.length - 1].url}/${this.poi.type}`,
                    });
                }
                return breadCrumbs;
            },
        },
        methods: {
            ...mapActions({
                get: 'poi/get',
                setId: 'poi/setId',
            }),
        },
    };
</script>
