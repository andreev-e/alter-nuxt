<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: 'Авторы', url: '/user/' }, { name: $route.params.id, url: '' }]"
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
                <bage
                    class="bg-primary text-white"
                >
                    опубликовано {{ user.publications }}
                </bage>
                <bage class="bg-warning">
                    C нами с {{ user.regdate }}
                </bage>
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
            fit-content
        />
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import UniversalMap from '../../components/UniversalMap.vue';
    import Bage from '../../components/ui/Bage.vue';

    export default {
        components: { Bage, UniversalMap, Breadcrumbs },
        data() {
            return {
                location: { lat: 0, lng: 0 },
                mapPois: [],
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
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
