<template>
    <form @submit.prevent="onSubmit">
        <client-only>
            <gmap-map
                ref="map"
                :zoom="12"
                map-type-id="terrain"
                :center="center"
            >
                <gmap-marker
                    :position="center"
                    draggable
                    @dragend="markerMoved"
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
        <select-input
            v-model="form.type"
            label="Категория"
            :options="types"
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
            id="route"
            v-model="form.route"
            label="Как добраться на машине"
            multiline
            :form="form"
        />
        <text-input
            id="route_o"
            v-model="form.route_o"
            label="Как добраться на общественном транспорте"
            multiline
            :form="form"
        />
        <text-input
            id="addon"
            v-model="form.addon"
            label="Примечание"
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
    // eslint-disable-next-line import/extensions
    import { TYPES } from '../../constants/index.js';
    import TextInput from '../ui/TextInput.vue';
    import SelectInput from '../ui/SelectInput.vue';

    export default {
        name: 'PoiForm',
        components: {
            SelectInput,
            TextInput,
        },
        props: {
            poi: {
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
                    route: null,
                    route_o: null,
                    addon: null,
                    lat: null,
                    lng: null,
                    type: null,
                    links: null,
                }, {
                    removeNullValues: false,
                }),
            };
        },
        computed: {
            center: {
                get() {
                    if (this.poi) {
                        return {
                            lat: this.poi.lat,
                            lng: this.poi.lng,
                        };
                    }
                    if (this.form) {
                        return {
                            lat: this.form.lat,
                            lng: this.form.lng,
                        };
                    }
                    return {
                        lat: 0,
                        lng: 0,
                    };
                },
                set(val) {
                    this.form.lat = val.lat;
                    this.form.lng = val.lng;
                },
            },
            types() {
                return TYPES;
            },
        },
        watch: {
            poi(poi) {
                ['name', 'description', 'route', 'route_o', 'addon', 'type', 'lat', 'lng', 'links'].forEach((field) => {
                    this.form[field] = poi[field];
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
                let url = '/api/poi';
                if (this.$route.params.id) {
                    url = `${url}/${this.$route.params.id}`;
                    this.form.addField('_method', 'PATCH');
                }

                this.form.submit(url)
                    .then(() => {
                        this.$router.back();
                    });
            },
            markerMoved(e) {
                this.center = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                };
            },
        },
    };
</script>

<style scoped>

</style>
