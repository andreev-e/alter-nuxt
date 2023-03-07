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
                                v-if="$auth.loggedIn"
                                icon="fa-star"
                                :class="inFav(poi.id) ? 'text-warning' : 'text-light'"
                                role="button"
                                @click="toggleFav(poi.id)"
                            />
                        </client-only>
                        {{ poi.name }}
                        <client-only>
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
                    </h1>
                    <badge
                        class="bg-secondary"
                        :url="`/user/${poi.author}`"
                    >
                        {{ poi.author }}
                    </badge>
                    <badge
                        class="bg-primary text-white"
                    >
                        Опубликовано {{ $moment(poi.created_at).format('LL') }}
                    </badge>
                    <badge
                        v-if="poi.updated_at"
                        class="bg-success text-white"
                    >
                        Обновлено {{ $moment(poi.updated_at).format('LL') }}
                    </badge>
                    <badge
                        v-for="tag in poi.tags"
                        :key="tag.id"
                        class="bg-info"
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
                                :dominate-color="poi.dominatecolor"
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
                            title="Маршруты"
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
                        <b-tab title="Локация">
                            <div class="py-3 px-3">
                                <client-only>
                                    <universal-map
                                        v-if="loaded"
                                        :center="{ lat: poi.lat, lng: poi.lng }"
                                        :zoom="10"
                                        this-is-poi
                                    />
                                </client-only>
                                <div class="row pt-3">
                                    <div class="col-sm-12">
                                        <nuxt-link
                                            to="/izbannoye"
                                            class="btn btn-secondary mr-2"
                                        >
                                            Построить маршрут с данной точкой
                                        </nuxt-link>
                                        <a
                                            id="geo"
                                            class="btn btn-secondary"
                                            :href="`https://maps.google.com/maps?daddr=${poi.lat},${poi.lng}&amp;ll=`"
                                        >Навигация на точку</a>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab :title="`Посетили (${poi.checkins ? poi.checkins.length: 0})`">
                            <checkins
                                :poi="poi"
                                @change="get"
                            />
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
                        small
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
    import fav from '../../mixins/fav';
    import Checkins from '../../components/poi/Checkins.vue';

    export default {
        components: {
            Checkins,
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
        mixins: [fav],
        async fetch() {
            try {
                await this.setId(this.$route.params.id);
                await this.get();
            } catch (error) {
                this.$nuxt.context.error({
                    status: 404,
                    message: error.message,
                });
            }
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
