<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="crumbs" />
        <div class="row">
            <div class="col-sm-12">
                <h1 class="view">
                    <client-only>
                        <router-link
                            v-if="canEdit"
                            :to="`/secure/route/${route.id}`"
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
                    {{ route.name }}
                </h1>
                <badge
                    class="bg-warning"
                    :url="`/user/${route.author}`"
                >
                    {{ route.author }}
                </badge>
                <badge
                    v-if="route.days"
                    class="bg-primary text-white"
                >
                    {{ $t('ROUTE.DAYS', { days: route.days }) }}
                </badge>
                <badge
                    v-if="route.cost"
                    class="bg-warning"
                >
                    {{ $t('ROUTE.COST', { cost: route.cost }) }}
                </badge>
                <client-only>
                    <badge
                        v-if="routeLength"
                        class="bg-primary text-white"
                    >
                        {{ routeLength }} {{ $t('UI.KM') }}
                    </badge>
                </client-only>
                <badge class="bg-warning">
                    {{ $t('UI.PUBLISHED') }} - {{ route.date }}
                </badge>
                <views-badge :views="route.views" />
            </div>
        </div>
        <b-row>
            <div class="col-sm-12">
                <client-only>
                    <universal-map
                        ref="routeMap"
                        :zoom="6"
                        :route="route"
                        fit-content
                        @update="mapUpdated"
                    />
                </client-only>
            </div>
            <div class="col-sm-12 rich-text">
                <template v-if="route.pois && route.pois.length">
                    <h2>В маршрут входят точки</h2>
                    <item-gallery
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
                <template
                    v-if="route.links"
                >
                    <h2 id="links">
                        Ссылки
                    </h2>
                    <text-with-links :text="route.links" />
                </template>
            </div>
            <div class="col-sm-12">
                <div
                    class="route_photoes"
                    style="height: auto !important;"
                >
                    <div
                        v-if="route.images && route.images.length"
                        class="route_photoes"
                    >
                        <h2>Фото</h2>
                        <super-gallery
                            :alt="route.name"
                            :images="route.images"
                        />
                        <p>&copy; Все права на опубликованные фотографии принадлежат автору публикации.</p>
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
    import UniversalMap from '../../components/map/UniversalMap.vue';
    import Badge from '../../components/ui/Badge.vue';
    import ItemGallery from '../../components/ItemGallery.vue';
    import SuperGallery from '../../components/SuperGallery.vue';
    import ViewsBadge from '../../components/badges/ViewsBadge.vue';
    import TextWithLinks from '../../components/ui/TextWithLinks.vue';

    export default {
        components: {
            TextWithLinks,
            ViewsBadge,
            SuperGallery,
            ItemGallery,
            Badge,
            UniversalMap,
            Comments,
            Breadcrumbs,
        },
        data() {
            return {
                page: 1,
                routeLength: 0,
            };
        },
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
            const description = [
                this.$t('ROUTE.SEO_DESCRIPTION'),
                this.route.days ? this.$t('ROUTE.SEO_DAYS', { days: this.route.days }) : '',
                this.route.cost ? this.$t('ROUTE.SEO_COST', { cost: this.route.cost }) : '',
            ].filter(Boolean).join(' ');
            const poi = (this.route.pois || []).find((item) => item.thumb);
            const image = (this.route.images && this.route.images.length && this.route.images[0].original)
                || this.route.thumb || (poi && poi.thumb);

            return this.$seo.head({
                title: this.route.name,
                description: `${this.route.name}. ${description}. ${this.route.description || ''}`,
                image,
                type: 'article',
            });
        },
        computed: {
            ...mapGetters({
                route: 'route/model',
                loaded: 'route/isEmpty',
            }),
            crumbs() {
                return [
                    {
                        name: this.$t('ROUTE.ROUTES'),
                        url: '/route',
                    },
                    {
                        name: this.route.name,
                    },
                ];
            },
            canEdit() {
                return this.$auth.user && (this.isAdmin || this.isOwner);
            },
            isOwner() {
                return this.$auth.user && this.$auth.user.username === this.route.author;
            },
            isAdmin() {
                return this.$auth.user && this.$auth.user.username === 'andreev';
            },
        },
        methods: {
            ...mapActions({
                get: 'route/get',
                setId: 'route/setId',
            }),
            mapUpdated() {
                this.routeLength = this.$refs.routeMap.getRouteLength();
            },
        },
    };
</script>

<style scoped>

</style>
