<template>
    <form @submit.prevent="onSubmit">
        <client-only>
            <gmap-map
                ref="map"
                :zoom="zoom"
                map-type-id="terrain"
                :center="center"
            >
                <gmap-marker
                    v-if="start"
                    :position="start"
                    :icon="iconStart"
                    draggable
                    @dragend="startMoved"
                />
                <gmap-marker
                    v-if="finish"
                    :position="finish"
                    :icon="iconFinish"
                    draggable
                    @dragend="finishMoved"
                />
                <gmap-polyline
                    v-if="route && route.encoded_route"
                    ref="polyline"
                    :path="path"
                    :options="{ strokeColor: '#FF0000' }"
                    editable
                    @dragend="polylineChanged"
                />
            </gmap-map>
        </client-only>
        <text-input
            id="name"
            v-model="form.name"
            label="Название"
            :form="form"
            required
        />
        <text-input
            id="description"
            v-model="form.description"
            label="Описание"
            multiline
            required
            :form="form"
        />
        <text-input
            id="cost"
            v-model="form.cost"
            label="Бюджет, руб"
            :form="form"
            type="number"
        />
        <text-input
            id="days"
            v-model="form.days"
            label="Длительность, дней"
            :form="form"
            type="number"
        />
        <text-input
            id="route"
            v-model="form.route"
            label="Особенности"
            multiline
            :form="form"
        />
        <text-input
            id="links"
            v-model="form.links"
            label="Ссылки"
            multiline
            :form="form"
        />
        <button
            type="submit"
            class="btn btn-success"
        >
            Сохранить
        </button>
    </form>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { Form } from 'laravel-request-utils';
    import { gmapApi } from 'vue2-google-maps';
    import TextInput from '../ui/TextInput.vue';

    export default {
        name: 'RouteForm',
        components: {
            TextInput,
        },
        props: {
            route: {
                type: Object,
                required: false,
                default: () => {
                },
            },
        },
        data() {
            return {
                form: new Form({
                    name: null,
                    description: null,
                    cost: null,
                    days: null,
                    route: null,
                    links: null,
                    start: null,
                    finish: null,
                }, {
                    removeNullValues: false,
                }),
                iconStart: {
                    url: '/start.png',
                },
                iconFinish: {
                    url: '/end.png',
                },
            };
        },
        computed: {
            google: gmapApi,
            center: {
                get() {
                    if (this.route && ((this.route.start && this.route.finish) || this.route.encoded_route)) {
                        return {
                            lat: (this.start.lat + this.finish.lat) / 2,
                            lng: (this.start.lng + this.finish.lng) / 2,
                        };
                    }
                    return {
                        lat: 0,
                        lng: 0,
                    };
                },
                set(val) {
                    console.log('senter', val);
                },
            },
            zoom() {
                // console.log(this.distance(this.start, this.finish));
                return 9;
            },
            start() {
                if (this.route && this.route.start) {
                    const start = this.route.start.split(';');
                    return {
                        lat: parseFloat(start[0]),
                        lng: parseFloat(start[1]),
                    };
                }
                if (this.route && this.route.encoded_route && this.path.length > 1) {
                    return this.path[0];
                }
                return false;
            },
            finish() {
                if (this.route && this.route.finish) {
                    const finish = this.route.finish.split(';');
                    return {
                        lat: parseFloat(finish[0]),
                        lng: parseFloat(finish[1]),
                    };
                }
                if (this.route && this.route.encoded_route && this.path.length > 1) {
                    return this.path[this.path.length - 1];
                }
                return false;
            },
            path() {
                if (this.google && this.route && this.route.encoded_route) {
                    return this.google.maps.geometry.encoding
                        .decodePath(this.route.encoded_route);
                }
                return [];
            },
        },
        watch: {
            route(route) {
                ['name', 'description', 'cost', 'days', 'route', 'links']
                    .forEach((field) => {
                        this.form[field] = route[field];
                    });
            },
        },
        created() {
            const center = {
                lat: 0,
                lng: 0,
            };
            if (process.client && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        center.lat = position.coords.latitude;
                        center.lng = position.coords.longitude;
                        this.center = center;
                    },
                    () => {
                    },
                );
            }
        },
        methods: {
            onSubmit() {
                let url = '/api/route';
                if (this.$route.params.id) {
                    url = `${url}/${this.$route.params.id}`;
                    this.form.addField('_method', 'PATCH');
                }

                this.form.submit(url)
                    .then((result) => {
                        if (this.$route.params.id) {
                            this.$router.push('/secure/');
                        } else {
                            this.$alert('Сохранено. Теперь вы можете добавить фото');
                            this.$router.push(`/secure/route/${result.data.id}`);
                        }
                    });
            },
            startMoved(e) {
                this.form.start = `${e.latLng.lat()};${e.latLng.lng()}`;
            },
            finishMoved(e) {
                this.form.finish = `${e.latLng.lat()};${e.latLng.lng()}`;
            },
            polylineChanged(e) {
                console.log(e);
            },
            distance(p1, p2) {
                const R = 6378137; // Earth’s mean radius in meter
                const dLat = this.rad(p2.lat() - p1.lat());
                const dLong = this.rad(p2.lng() - p1.lng());
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                    + Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat()))
                    * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            },
            rad(x) {
                return (x * Math.PI) / 180;
            },
        },
    };
</script>

<style scoped>

</style>
