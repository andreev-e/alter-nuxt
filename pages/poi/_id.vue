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
                    v-for="tag in poi.tags"
                    :key="tag.id"
                    class="bg-primary"
                    :to="tag.url"
                    :url="tag.url"
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
                    {{ poi.comments }} комментариев
                </bage>
            </div>
        </div>
        <Fastnav />
        <div class="row inner">
            <div class="col-sm-8 object-full">
                <div class="near">
                    <b-tabs>
                        <b-tab title="Фото">
                            <div class="d-flex flex-wrap py-3">
                                <preview
                                    v-for="image in poi.images"
                                    :key="image.id"
                                    :alt="poi.name"
                                    :url="image.preview"
                                    :full="image.original"
                                />
                                <nuxt-link :to="`/user/${poi.author}`">
                                    &copy; {{ poi.copyright ? poi.copyright : poi.author }}
                                </nuxt-link>
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
                                <div class="coords plusplus_sl">
                                    <div class="qr">
                                        <img
                                            src="https://altertravel.ru/qr.php?lng=43.455948&amp;lat=43.123161"
                                            alt="QR code"
                                        >
                                    </div>
                                    <div class="points">
                                        <span>{{ poi.lat }},&nbsp;{{ poi.lng }}</span>
                                        <a href="https://altertravel.ru/generate_kml.php?id=22728">
                                            <div class="dwnl-kml">
                                                <span>скачать KML файл</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
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
                    </b-tabs>
                </div>
            </div>
            <div class="col-sm-4">
                <h2 id="interesting">
                    Описание
                </h2>
                <p>
                    {{ poi.description }}
                </p>
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
                <div class="near">
                    <Gallery
                        :objects="poi.nearest"
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <h2
                    v-if="poi.route"
                    id="route"
                >
                    Как добраться на машине
                </h2>
                <p>{{ poi.route }}</p>
            </div>
            <div class="col-sm-4">
                <h2
                    v-if="poi.route_o"
                    id="route_o"
                >
                    Как добраться на общественном транспорте
                </h2>
                <p>{{ poi.route_o }}</p>
            </div>
            <div
                v-if="poi.links"
                class="col-sm-4"
            >
                <h2 id="links">
                    Ссылки
                </h2>
                <p>
                    {{ poi.links }}
                </p>
            </div>
            <div class="col-sm-12">
                <h2
                    v-if="poi.addon"
                    id="addon"
                >
                    Примечание
                </h2>
                <p>{{ poi.addon }}</p>
                <nuxt-link
                    to="/izbannoye"
                    class="btn btn-dark"
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
    import Fastnav from '../../components/Fastnav.vue';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import UniversalMap from '../../components/UniversalMap.vue';
    import Gallery from '../../components/Gallery.vue';
    import Preview from '../../components/Preview.vue';
    import Bage from '../../components/ui/Bage.vue';

    export default {
        components: {
            Bage,
            Preview,
            Gallery,
            UniversalMap,
            Breadcrumbs,
            Fastnav,
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
                const breadCrumbs = [...this.poi.locations ?? []];
                if (this.poi && this.poi.locations && this.poi.locations.length) {
                    breadCrumbs.push({
                        name: this.poi.type,
                        url: `${this.poi.locations[this.poi.locations.length - 1].url}/${this.poi.type}`,
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
