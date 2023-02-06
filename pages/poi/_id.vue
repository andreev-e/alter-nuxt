<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12">
                <h1 class="view">
                    {{ poi.name }}
                </h1>
            </div>
        </div>
        <Fastnav />
        <div class="row inner">
            <div class="col-sm-8 object-full">
                <div class="near">
                    <b-tabs>
                        <b-tab title="Фото">
                            <div class="view_image">
                                <div id="bigimage">
                                    <img
                                        :src="'https://altertravel.ru/full.php?f=/images/' + $route.params.id + '.jpg'"
                                        class="img-fluid"
                                        :alt="poi.name"
                                    >
                                </div>
                                <div id="thumbs">
                                    <div
                                        v-for="i in 3"
                                        :key="i"
                                        class="gal-img"
                                    >
                                        <a
                                            :href="`https://altertravel.ru/full.php?f=/images/${$route.params.id}/${i}.jpg`"
                                        >
                                            <img
                                                :src="`https://altertravel.ru/thumb.php?f=/images/${$route.params.id}/${i}.jpg`"
                                                :alt="poi.name"
                                                class="img-fluid"
                                            >
                                        </a>
                                    </div>
                                </div>
                                <p>
                                    {{ poi.author }}
                                    <a href="https://altertravel.ru/show_user.php?name=olegoo">автор</a> © Все права на опубликованные
                                    фотографии и видео принадлежат их авторам
                                </p>
                            </div>
                        </b-tab>
                        <b-tab title="Где находится?">
                            <client-only>
                                <gmap-map
                                    v-if="center"
                                    :center="center"
                                    :zoom="7"
                                    map-type-id="terrain"
                                >
                                    <gmap-marker
                                        :position="center"
                                        :clickable="true"
                                    />
                                </gmap-map>
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
            <div class="col-sm-6">
                <h2
                    v-if="poi.route"
                    id="route"
                >
                    Как добраться на машине
                </h2>
                <p>{{ poi.route }}</p>
            </div>
            <div class="col-sm-6">
                <h2
                    v-if="poi.route_o"
                    id="route_o"
                >
                    Как добраться на общественном транспорте
                </h2>
                <p>{{ poi.route_o }}</p>
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
                    class="poi__card"
                >
                    Построить маршрут с данной точкой
                </nuxt-link>
                <a
                    id="geo"
                    class="button btn"
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

    export default {
        data() {
            return {
                center: null,
            };
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
                if (this.poi && this.poi.locations) {
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
