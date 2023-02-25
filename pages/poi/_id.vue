<template>
    <div class="container page">
        <Header />
        <b-spinner v-if="loading" />
        <template v-else>
            <Breadcrumbs :list="breadCrumbs" />
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="view">
                        <client-only>
                            <font-awesome-icon
                                icon="fa-star"
                                class="text-danger"
                                role="button"
                            />
                            <router-link
                                v-if="canEdit"
                                :to="`/secure/poi/${poi.id}`"
                                class="d-inline-block mr-1 mt-1"
                                title="Редактировать"
                            >
                                <font-awesome-icon
                                    icon="fa-edit"
                                    class="text-primary"
                                    role="button"
                                />
                            </router-link>
                        </client-only>
                        {{ poi.name }}
                    </h1>
                    <badge
                        class="bg-warning"
                        :url="`/user/${poi.author}`"
                    >
                        {{ poi.author }}
                    </badge>
                    <badge
                        v-for="tag in poi.tags"
                        :key="tag.id"
                        class="bg-primary"
                        :url="`/tag/${tag.url}`"
                    >
                        {{ tag.name }}
                    </badge>
                    <views-badge :views="poi.views" />
                    <comment-bage
                        v-if="poi && poi.comments"
                        :count="poi.comments"
                    />
                </div>
            </div>
            <div class="row inner">
                <div class="col-sm-12 object-full">
                    <b-tabs>
                        <b-tab
                            title="Фото"
                            class="my-3"
                        >
                            <super-gallery
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
                            class="my-3"
                        >
                            <div class="embed-responsive embed-responsive-16by9">
                                <iframe
                                    width="560"
                                    height="315"
                                    :src="`https://www.youtube.com/embed/${poi.ytb}`"
                                />
                            </div>
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
                                    <text-with-links :text="poi.links" />
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
        </template>
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
    import ItemGallery from '../../components/ItemGallery.vue';
    import CommentBage from '../../components/poi/CommentBage.vue';
    import SuperGallery from '../../components/SuperGallery.vue';
    import Badge from '../../components/ui/Badge.vue';
    import ViewsBadge from '../../components/badges/ViewsBadge.vue';
    import TextWithLinks from '../../components/ui/TextWithLinks.vue';

    export default {
        components: {
            TextWithLinks,
            ViewsBadge,
            SuperGallery,
            CommentBage,
            ItemGallery,
            Badge,
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
                title: `${this.poi.name}${this.poi.locations && this.poi.locations.length ? `, ${this.poi.locations[0]?.name}` : ''}`,
                meta: [
                    {
                        name: 'description',
                        content: `${this.poi.name} - как добраться проезда на машине и общественным транспортом. Координаты, отзывы, фотографии`,
                    },
                ],
                link: [
                    {
                        rel: 'canonical',
                        href: `/poi/${this.poi.id}`,
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                poi: 'poi/model',
                loaded: 'poi/isEmpty',
                loading: 'poi/loading',
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
            canEdit() {
                return this.$auth.user && (this.isAdmin || this.isOwner);
            },
            isOwner() {
                return this.$auth.user && this.$auth.user.username === this.poi.author;
            },
            isAdmin() {
                return this.$auth.user && this.$auth.user.username === 'andreev';
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
