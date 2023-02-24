<template>
    <form @submit.prevent="onSubmit">
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
            <p
                v-if="form.errors.errors.lat || form.errors.errors.lng"
                class="text-danger mt-1 text-sm"
            >
                Укажите точку на карте
            </p>
        </div>
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
        <b-row
            v-if="form.ytb"
            class="my-2"
        >
            <b-col
                md="3"
                cols="12"
                class="text-md-right text-sm-center mt-2"
            />
            <b-col
                cols="12"
                md="9"
            >
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe
                        width="560"
                        height="315"
                        :src="`https://www.youtube.com/embed/${form.ytb}`"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    />
                </div>
            </b-col>
        </b-row>

        <text-input
            id="copyright"
            v-model="form.copyright"
            label="Автор фотографий (если используются не свои фотографии) "
            :form="form"
        />
        <h2>Метки</h2>
        <b-input
            v-model="tagSearch"
            placeholder="Поиск меток"
            class="w-100 my-3"
        />
        <div class="d-flex flex-wrap">
            <input-checkbox
                v-for="tag in filteredTags"
                :id="tag.name"
                :key="tag.id"
                :class="{ 'bg-secondary': tag.active }"
                :label="tag.name"
                :model-value="isChecked(tag.id)"
                @update="onInput($event, tag.id)"
            />
        </div>
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
        name: 'PoiForm',
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
                    tags: [],
                }, {
                    removeNullValues: false,
                }),
                tagSearch: null,
            };
        },
        computed: {
            ...mapGetters({
                tags: 'tags/items',
            }),
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
            filteredTags() {
                return this.tags.filter((tag) => !this.tagSearch || tag.name.toLowerCase().includes(this.tagSearch.toLowerCase()));
            },
        },
        watch: {
            poi(poi) {
                ['name', 'description', 'route', 'route_o', 'addon', 'type', 'lat', 'lng', 'links', 'ytb', 'copyright']
                    .forEach((field) => {
                        this.form[field] = poi[field];
                    });
                ['tags'].forEach((field) => {
                    this.form[field] = poi[field].map((tag) => tag.id);
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
                    .then((result) => {
                        if (this.$route.params.id) {
                            this.$router.push('/secure/');
                        } else {
                            this.$alert('Сохранено. Теперь вы можете добавить фото');
                            this.$router.push(`/secure/poi/${result.data.id}`);
                        }
                    });
            },
            markerMoved(e) {
                this.form.errors.errors.lat = undefined;
                this.form.errors.errors.lng = undefined;
                this.center = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                };
                this.form.lat = e.latLng.lat();
                this.form.lng = e.latLng.lng();
            },
            isChecked(value) {
                return this.form.tags.find((item) => item === value) !== undefined;
            },
            onInput(isChecked, value) {
                if (isChecked && !this.isChecked(value)) {
                    this.form.tags.push(value);
                }
                if (!isChecked) {
                    // eslint-disable-next-line eqeqeq
                    const index = this.form.tags.findIndex((item) => item == value);
                    this.form.tags.splice(index, 1);
                }
            },
        },
    };
</script>

<style scoped>

</style>
