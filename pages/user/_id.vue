<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: $t('MENU.AUTHORS'), url: '/user/' }, { name: $route.params.id, url: '' }]"
        />
        <div class="row">
            <div
                v-if="user.thumb"
                class="col-sm-2"
            >
                <img
                    class="img-fluid"
                    :src="user.thumb"
                    :alt="user.username"
                >
            </div>
            <div class="col-sm-10">
                <h1>
                    {{ user.firstname }} {{ user.lastname }}
                </h1>
                <badge
                    class="bg-primary text-white"
                >
                    {{ $t('UI.PUBLISHED') + ' ' + user.publications }}
                </badge>
                <badge class="bg-warning">
                    {{ $t('AUTHORS.WITH_US_FROM') + ' ' + user.regdate }}
                </badge>
                <p
                    v-if="user.about && $i18n.locale === 'ru'"
                    class="description"
                >
                    <b>{{ user.about }}</b>
                </p>
            </div>
        </div>
        <client-only>
            <universal-map
                ref="mapComponent"
                v-model="mapPois"
                :user="$route.params.id"
                :zoom="4"
                fit-content
            />
        </client-only>
        <user-checkins :user="user" />
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import UniversalMap from '../../components/map/UniversalMap.vue';
    import Badge from '../../components/ui/Badge.vue';
    import UserCheckins from '../../components/user/UserCheckins.vue';

    export default {
        components: {
            UserCheckins,
            Badge,
            UniversalMap,
            Breadcrumbs,
        },
        data() {
            return {
                location: { lat: 0, lng: 0 },
                mapPois: [],
            };
        },
        async fetch() {
            try {
                await this.setId(this.$route.params.id);
                await this.getUser();
            } catch (error) {
                this.$nuxt.context.error({
                    status: 404,
                    message: error.message,
                });
            }
        },
        head: {
            title: 'Карта достопримечательностей для самостоятельных путешественников',
            meta: [
                {
                    name: 'description',
                    content: 'Каталог достопримечательностей на карте . Для самостоятельной организации путешествия!',
                },
            ],
        },
        computed: {
            ...mapGetters({
                user: 'user/model',
            }),
        },
        mounted() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                    },
                    () => {
                    },
                );
            }
        },
        methods: {
            ...mapActions({
                setId: 'user/setId',
                getUser: 'user/get',
            }),
        },
    };
</script>
