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
                    {{ route.days }} дней
                </badge>
                <badge
                    v-if="route.cost"
                    class="bg-warning"
                >
                    {{ route.cost }} руб.
                </badge>
                <client-only>
                    <badge
                        v-if="routeLength"
                        class="bg-primary text-white"
                    >
                        {{ routeLength }} км
                    </badge>
                </client-only>
                <badge class="bg-warning">
                    Опубликовано - {{ route.date }}
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
            <div class="col-sm-12">
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
            return {
                title: this.route.name,
                meta: [
                    {
                        name: 'description',
                        content: `Готовый маршрут с достопримечательностями ${this.route.days ? `на ${this.route.days} дней` : ''}${this.route.cost ? `, за ${this.route.cost} рублей` : ''}`,
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
