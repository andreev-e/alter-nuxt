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
                        {{ name }}
                        <client-only>
                            <router-link
                                v-if="canEdit"
                                :to="`/secure/poi/${poi.id}`"
                                class="d-inline-block mr-1 mt-1"
                                :title="$t('UI.EDIT')"
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
                        {{ $t('UI.PUBLISHED') }} {{ $moment(poi.created_at).format('LL') }}
                    </badge>
                    <badge
                        v-if="poi.updated_at && $moment(poi.created_at).format('LL') !== $moment(poi.updated_at).format('LL')"
                        class="bg-success text-white"
                    >
                        {{ $t('UI.UPDATED') }}&nbsp;{{ $moment(poi.updated_at).format('LL') }}
                    </badge>
                    <badge
                        v-for="tag in poi.tags"
                        :key="tag.id"
                        class="bg-info"
                        :url="`/tag/${tag.url}`"
                    >
                        {{ $i18n.locale === 'en' ? tag.name_en : tag.name }}
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
                            v-if="poi.images && poi.images.length"
                            :title="$t('UI.PHOTO')"
                            class="my-3"
                        >
                            <super-gallery
                                :alt="name"
                                :images="poi.images"
                                :dominate-color="poi.dominatecolor"
                            />
                            <nuxt-link :to="`/user/${poi.author}`">
                                &copy; {{ poi.copyright ? poi.copyright : poi.author }}
                            </nuxt-link>
                        </b-tab>
                        <b-tab
                            v-if="poi.ytb"
                            :title="$t('UI.VIDEO')"
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
                        <b-tab :title="$t('UI.DESCRIPTION')">
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
                                        {{ $t('POI.HOW_TO_GET_BY_CAR') }}
                                    </h2>
                                    <p>{{ poi.route }}</p>
                                </template>
                                <template
                                    v-if="poi.route_o"
                                >
                                    <h2 id="route_o">
                                        {{ $t('POI.HOW_TO_GET_BY_PUBLIC_TRANSPORT') }}
                                    </h2>
                                    <p>{{ poi.route_o }}</p>
                                </template>
                                <template
                                    v-if="poi.links"
                                >
                                    <h2 id="links">
                                        {{ $t('POI.LINKS') }}
                                    </h2>
                                    <text-with-links :text="poi.links" />
                                </template>
                                <template
                                    v-if="poi.addon"
                                >
                                    <h2 id="addon">
                                        <h2 id="links">
                                            {{ $t('POI.ADDON') }}
                                        </h2>
                                    </h2>
                                    <p>{{ poi.addon }}</p>
                                </template>
                            </div>
                        </b-tab>
                        <b-tab
                            v-if="loaded && poi.routes.length"
                            :title="$t('UI.ROUTES')"
                        >
                            <div class="py-3">
                                <h2 id="near">
                                    {{ $t('UI.ROUTES') }}
                                </h2>
                                <div class="near">
                                    <item-gallery
                                        :objects="poi.routes"
                                        type="route"
                                    />
                                </div>
                            </div>
                        </b-tab>
                        <b-tab :title="$t('UI.LOCATION')">
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
                                        <a
                                            id="geo"
                                            class="btn btn-secondary"
                                            :href="`https://maps.google.com/maps?daddr=${poi.lat},${poi.lng}&amp;ll=`"
                                        >{{ $t('POI.NAVIGATE') }}</a>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab :title="`${$t('UI.VISITED')} (${poi.checkins ? poi.checkins.length: 0})`">
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
                        {{ $t('UI.NEAR') }}
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
                title: this.title,
                meta: [
                    {
                        name: 'description',
                        content: `${this.name} - ${this.$t('SEO.HOW_TO_GET_TO')}. ${this.$t('SEO.END_OF_DESCRIPTION')}`,
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
            title() {
                return `${this.name}${this.poi.locations && this.poi.locations.length ? `, ${this.poi.locations[this.poi.locations.length - 1][this.$i18n.locale === 'en' ? 'name_en' : 'name']}` : ''}`;
            },
            name() {
                return this.$i18n.locale === 'en' && this.poi.name_en ? this.poi.name_en : this.poi.name;
            },
            breadCrumbs() {
                const breadCrumbs = [...this.poi.locations ?? []].map((location) => ({
                    name: this.$i18n.locale === 'en' && location.name_en ? location.name_en : location.name,
                    url: `/region/${location.url}`,
                }));
                if (this.poi && this.poi.locations && this.poi.locations.length) {
                    breadCrumbs.push({
                        name: this.$t(`CATEGORY.${this.poi.type.toUpperCase()}`),
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
