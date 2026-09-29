<template>
    <form @submit.prevent="onSubmit">
        <client-only>
            <badge
                v-if="routeLength"
                class="bg-primary text-white"
            >
                {{ routeLength }} км
            </badge>
            <badge
                v-if="form.pois.length"
                class="bg-warning"
            >
                {{ form.pois.length }} точек по пути
            </badge>

            <div class="map-container">
                <l-map
                    ref="map"
                    :zoom="8"
                    :center="center"
                    @ready="observeMapSize"
                >
                    <l-tile-layer
                        :url="tileUrl"
                        :attribution="tileAttribution"
                    />
                    <l-marker
                        v-if="start"
                        :lat-lng="start"
                        :icon="iconStart"
                        draggable
                        @dragend="startMoved"
                    />
                    <l-marker
                        v-if="finish"
                        :lat-lng="finish"
                        :icon="iconFinish"
                        draggable
                        @dragend="finishMoved"
                    />
                    <editable-polyline
                        v-if="manual"
                        :lat-lngs="path"
                        @change="polylineChanged"
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
                    <l-marker
                        v-for="poi in poisForRoute"
                        :key="`poi_`+poi.id"
                        :lat-lng="{ lat: poi.lat, lng: poi.lng }"
                        :options="{ title: poi.name }"
                        :icon="getIcon(poi.type)"
                        @click="$router.push('/poi/' + poi.id)"
                    />
                </l-map>
            </div>
        </client-only>
        <el-row
            :gutter="30"
            class="mt-3"
        >
            <el-col
                :xs="24"
                :sm="6"
                class="text-center text-md-right mt-2"
            >
                Точки (до 8 шт)
            </el-col>
            <el-col
                :xs="24"
                :sm="18"
            >
                <el-select
                    v-model="form.pois"
                    multiple
                    filterable
                    remote
                    :multiple-limit="8"
                    reserve-keyword
                    placeholder="Поиск объектов"
                    :remote-method="remoteSearch"
                    :loading="loading"
                >
                    <el-option
                        v-for="poi in selectedPois"
                        :key="poi.id"
                        :label="poi.name"
                        :value="poi.id"
                    />
                </el-select>
            </el-col>
        </el-row>
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
            v-for="field in fields"
            :id="field.id"
            :key="field.id"
            v-model="form[field.id]"
            :label="field.label"
            :form="form"
            :required="field.required"
            :multiline="field.multiline"
            :type="field.type"
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
    import { Form, Request } from 'laravel-request-utils';
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapGetters } from 'vuex';
    import TextInput from '../ui/TextInput.vue';
    import Toggler from '../ui/Toggler.vue';
    import DirectionsRenderer from '../map/DirectionsRenderer.vue';
    import EditablePolyline from '../map/EditablePolyline.vue';
    import map from '../../mixins/map';
    import Badge from '../ui/Badge.vue';

    export default {
        name: 'RouteForm',
        components: {
            Badge,
            Toggler,
            TextInput,
            DirectionsRenderer,
            EditablePolyline,
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
                fields: [
                    { id: 'name', label: 'Название', required: true },
                    {
                        id: 'description', label: 'Описание', required: true, type: 'textarea',
                    },
                    { id: 'cost', label: 'Бюджет, руб', type: 'number' },
                    { id: 'days', label: 'Длительность, дней', type: 'number' },
                    { id: 'route', label: 'Особенности', type: 'textarea' },
                    { id: 'links', label: 'Ссылки', type: 'textarea' },
                ],
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
                    pois: [],
                }, {
                    removeNullValues: false,
                }),
                manual: false,
                travelMode: 'DRIVING',
                loading: false,
                pois: [],
                selectedPois: [],
                routeLength: 0,
            };
        },
        computed: {
            ...mapGetters({
                poiEndpoint: 'poisPaginated/endpoint',
            }),
            iconStart() {
                return this.getImageIcon('/start.png', [30, 21]);
            },
            iconFinish() {
                return this.getImageIcon('/end.png', [37, 21]);
            },
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
                set() {
                    // console.log('senter', val);
                },
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
            poisForRoute() {
                return this.selectedPois.filter((poi) => this.form.pois.includes(poi.id));
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
                if (this.form.encoded_route) {
                    return this.decodePath(this.form.encoded_route);
                }
                return [];
            },
            waypoints() {
                if (process.client && this.poisForRoute.length > 0) {
                    return this.poisForRoute
                        .map((poi) => ({
                            lat: poi.lat,
                            lng: poi.lng,
                        }));
                }
                return [];
            },
        },
        watch: {
            route(route) {
                this.selectedPois = [...route.pois];
                this.form.pois = route.pois.map((poi) => poi.id);
                ['name', 'description', 'cost', 'days', 'route', 'links', 'encoded_route', 'start', 'finish']
                    .forEach((field) => {
                        this.form[field] = route[field];
                    });
                if (this.form.encoded_route) {
                    this.manual = true;
                }
                if ((!this.form.start || !this.form.finish) && this.path.length) {
                    this.setEnds(this.path);
                }
            },
        },
        mounted() {
            if (process.client && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.form.start = `${position.coords.latitude};${position.coords.longitude}`;
                        this.form.finish = `${position.coords.latitude};${position.coords.longitude + 0.5}`;
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
                            this.$message.success('Сохранено. Теперь вы можете добавить фото');
                            this.$router.push(`/secure/route/${result.data.id}`);
                        }
                    });
            },
            startMoved(e) {
                const { lat, lng } = e.target.getLatLng();
                this.form.start = `${lat};${lng}`;
                this.updateManualEnds();
            },
            finishMoved(e) {
                const { lat, lng } = e.target.getLatLng();
                this.form.finish = `${lat};${lng}`;
                this.updateManualEnds();
            },
            updateManualEnds() {
                if (this.manual) {
                    this.form.encoded_route = this.encodePath([
                        this.start,
                        ...this.path.slice(1, -1),
                        this.finish,
                    ]);
                }
            },
            setEnds(path) {
                const first = path[0];
                const last = path[path.length - 1];
                this.form.start = `${first.lat};${first.lng}`;
                this.form.finish = `${last.lat};${last.lng}`;
            },
            polylineChanged(path) {
                this.form.encoded_route = this.encodePath(path);
                this.setEnds(path);
            },
            routeFound(length) {
                if (length === 0) {
                    this.$message.error('Маршрут не найден, переместите старт, финиш или точки по маршруту');
                    this.routeLength = 0;
                }
                this.routeLength = length;
            },
            manualChanged(val) {
                if (val) {
                    const path = [
                        this.start,
                        this.finish,
                    ];
                    this.form.encoded_route = this.encodePath(path);
                    return;
                }
                this.form.encoded_route = null;
            },
            remoteSearch(keyword) {
                if (keyword) {
                    this.loading = true;
                    Request.getInstance().get(this.poiEndpoint, {
                        params: {
                            keyword,
                            near: this.form.start,
                        },
                    }).then(({ data }) => {
                        this.pois = data.data;
                        this.selectedPois = [...this.poisForRoute, ...this.pois]
                            .filter((value, index, self) => index === self.findIndex((t) => (
                                t.id === value.id
                            )));
                        this.loading = false;
                    });
                    return;
                }
                this.pois = [];
            },
        },
    };
</script>

<style scoped>
    .el-select {
        width: 100%;
    }
</style>
