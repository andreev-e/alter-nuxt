<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: 'Авторы', url: '/user/' }, { name: $route.params.id, url: '' }]"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    {{ user.firstname }} {{ user.lastname }}
                </h1>
                <p>(опубликовано {{ user.publications }}, с нами с {{ user.regdate }})</p>
                <p
                    v-if="user.about"
                    class="description"
                >
                    <b>{{ user.about }}</b>
                </p>
            </div>
        </div>
        <universal-map
            ref="mapComponent"
            v-model="mapPois"
            :user="$route.params.id"
            :zoom="5"
            :center="mapCenter"
        />
        <Gallery
            :objects="mapPois.length ? mapPois : []"
        />
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import UniversalMap from '../../components/UniversalMap.vue';
    import Gallery from '../../components/Gallery.vue';

    export default {
        components: { Gallery, UniversalMap, Breadcrumbs },
        data() {
            return {
                location: { lat: 0, lng: 0 },
                mapPois: [],
            };
        },
        async fetch() {
            this.setId(this.$route.params.id);
            await this.getUser();
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
            mapCenter() {
                if (this.user.lat && this.user.lng) {
                    return { lat: this.user.lat, lng: this.user.lng };
                }
                return this.location;
            },
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
