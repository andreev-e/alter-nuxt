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
            <div class="text-center">
                {{ form.lat }};{{ form.lng }}
            </div>
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
        <text-input
            id="ytb"
            v-model="form.ytb"
            label="Youtube: https://www.youtube.com/watch?v="
            :form="form"
        />
        <text-input
            id="copyright"
            v-model="form.copyright"
            label="Автор фотографий (если используются не свои фотографии) "
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
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapGetters } from 'vuex';
    import { TYPES } from '../../constants/index';
    import TextInput from '../ui/TextInput.vue';
    import SelectInput from '../ui/SelectInput.vue';
    import InputCheckbox from '../ui/InputCheckbox.vue';

    export default {
        name: 'RouteForm',
        components: {
            InputCheckbox,
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
                    ytb: null,
                }, {
                    removeNullValues: false,
                }),
            };
        },
        computed: {
            center: {
                get() {
                    if (this.poi && this.poi.lat && this.poi.lng) {
                        return {
                            lat: this.poi.lat,
                            lng: this.poi.lng,
                        };
                    }
                    if (this.form && this.form.lat && this.form.lng) {
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
                set() { },
            },
            types() {
                return TYPES;
            },
        },
        watch: {
            poi(poi) {
                ['name', 'description', 'route', 'route_o', 'addon', 'type', 'lat', 'lng', 'links', 'ytb', 'copyright']
                    .forEach((field) => {
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
        },
    };
</script>

<style scoped>

</style>
