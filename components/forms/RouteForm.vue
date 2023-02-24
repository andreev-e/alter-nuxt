<template>
    <form @submit.prevent="onSubmit">
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
                v-if="manual"
                ref="polyline"
                :path="path"
                :options="{ strokeColor: '#FF0000' }"
                editable
                @path_changed="polylineChanged"
            />
            <directions-renderer
                v-else
                :origin="start"
                :waypoints="waypoints"
                :optimize-waypoints="true"
                :destination="finish"
                :travel-mode="travelMode"
                @routeFound="routeFound"
            />
            <template v-if="route">
                <gmap-marker
                    v-for="poi in route.pois"
                    :key="`poi_`+poi.id"
                    :position="{ lat: poi.lat, lng: poi.lng }"
                    clickable
                    :title="poi.name"
                    :icon="getIcon(poi.type)"
                    @click="$router.push('/poi/' + poi.id)"
                />
            </template>
        </gmap-map>
        <toggler
            id="manual"
            v-model="manual"
            :variants="[{ name: 'Автоматически', value: false }, { name: 'Вручную', value: true }]"
            label="Построение маршрута"
            @input="manualChanged"
        />
        <toggler
            v-if="!manual"
            id="map_type"
            v-model="travelMode"
            :variants="[{ name: 'Пешком', value: 'WALKING' }, { name: 'Машина', value: 'DRIVING' }, { name: 'Мотоцикл', value: 'TWO_WHEELER' }]"
            label="Вид транспорта"
        />
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
    import Toggler from '../ui/Toggler.vue';
    import DirectionsRenderer from '../map/DirectionsRenderer.vue';
    import map from '../../mixins/map';

    export default {
        name: 'RouteForm',
        components: {
            Toggler,
            TextInput,
            DirectionsRenderer,
        },
        mixins: [map],
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
                    encoded_route: null,
                }, {
                    removeNullValues: false,
                }),
                iconStart: {
                    url: '/start.png',
                },
                iconFinish: {
                    url: '/end.png',
                },
                manual: false,
                travelMode: 'DRIVING',
            };
        },
        computed: {
            google: gmapApi,
            center: {
                get() {
                    if (this.form.start && this.form.finish) {
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
                return 8;
            },
            start() {
                if (this.form.start) {
                    const start = this.form.start.split(';');
                    return {
                        lat: parseFloat(start[0]),
                        lng: parseFloat(start[1]),
                    };
                }
                return false;
            },
            finish() {
                if (this.form.finish) {
                    const finish = this.form.finish.split(';');
                    return {
                        lat: parseFloat(finish[0]),
                        lng: parseFloat(finish[1]),
                    };
                }
                return false;
            },
            path() {
                if (this.google && this.form.encoded_route) {
                    return this.google.maps.geometry.encoding
                        .decodePath(this.form.encoded_route);
                }
                return [];
            },
            waypoints() {
                if (process.client && this.route && this.route.pois && this.route.pois.length > 0) {
                    return this.route.pois.slice(0, 8)
                        .map((poi) => ({ location: { lat: poi.lat, lng: poi.lng }, stopover: true }));
                }
                return null;
            },
        },
        watch: {
            route(route) {
                ['name', 'description', 'cost', 'days', 'route', 'links', 'encoded_route', 'start', 'finish']
                    .forEach((field) => {
                        this.form[field] = route[field];
                    });
                if (this.form.encoded_route) {
                    this.manual = true;
                }
                if (!this.form.start || !this.form.finish) {
                    const path = this.google && this.form.encoded_route ? this.google.maps.geometry.encoding
                        .decodePath(this.form.encoded_route) : [];
                    this.form.start = `${path[0].lat()};${path[0].lng()}`;
                    this.form.finish = `${path[path.length - 1].lat()};${path[path.length - 1].lng()}`;
                }
            },
        },
        mounted() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.form.start = `${position.coords.latitude};${position.coords.longitude}`;
                        this.form.finish = `${position.coords.latitude};${position.coords.longitude + 0.5}`;
                    },
                );
            }
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
                if (this.google) {
                    let path = this.form.encoded_route ? this.google.maps.geometry.encoding
                        .decodePath(this.form.encoded_route) : [];
                    path = [
                        this.start,
                        ...path.slice(1, -1),
                        this.finish,
                    ];
                    this.form.encoded_route = this.google.maps.geometry.encoding
                        .encodePath(path);
                }
            },
            finishMoved(e) {
                this.form.finish = `${e.latLng.lat()};${e.latLng.lng()}`;
                if (this.google) {
                    let path = this.form.encoded_route ? this.google.maps.geometry.encoding
                        .decodePath(this.form.encoded_route) : [];
                    path = [
                        this.start,
                        ...path.slice(1, -1),
                        this.finish,
                    ];
                    this.form.encoded_route = this.google.maps.geometry.encoding
                        .encodePath(path);
                }
            },
            polylineChanged(e) {
                const arr = e.getArray();
                this.form.encoded_route = this.google.maps.geometry.encoding
                    .encodePath(arr);
                this.form.start = `${arr[0].lat()};${arr[0].lng()}`;
                this.form.finish = `${arr[arr.length - 1].lat()};${arr[arr.length - 1].lng()}`;
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
            routeFound(length) {
                if (length === 0) {
                    this.$alert('Маршрут не найден, переместите старт или финиш');
                }
                console.log('Route found', length);
            },
            manualChanged(val) {
                if (val) {
                    const path = [
                        this.start,
                        this.finish,
                    ];
                    this.form.encoded_route = this.google.maps.geometry.encoding
                        .encodePath(path);
                    return;
                }
                this.form.encoded_route = null;
            },
        },
    };
</script>

<style scoped>

</style>
