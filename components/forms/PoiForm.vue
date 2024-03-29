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
                {{ $t('MAP.SET_LOCATION') }}
            </p>
        </div>
        <select-input
            v-model="form.type"
            :label="$t('POI.FORM.CATEGORY')"
            :options="types"
            required
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
        <hr>
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
        <el-row :gutter="30">
            <el-col
                :xs="24"
                :sm="6"
                class="text-md-right text-sm-center mt-2"
            >
                {{ $t('POI.FORM.TAGS') }}
            </el-col>
            <el-col
                :xs="24"
                :sm="18"
            >
                <el-select
                    v-model="form.tags"
                    multiple
                    :placeholder="$t('POI.FORM.TAGS')"
                >
                    <el-option
                        v-for="tag in orderedTags"
                        :key="tag.id"
                        :label="tag.name"
                        :value="tag.id"
                    />
                </el-select>
            </el-col>
        </el-row>
        <button
            type="submit"
            class="btn btn-success"
        >
            {{ $t('UI.SAVE') }}
        </button>
    </form>
</template>

<script>
    import { Form } from 'laravel-request-utils';
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapGetters } from 'vuex';
    import { TYPES } from '../../constants/index';
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
                fields: [
                    {
                        id: 'name',
                        label: this.$t('POI.FORM.NAME'),
                        required: true,
                    },
                    {
                        id: 'name_en',
                        label: this.$t('POI.FORM.NAME_EN'),
                        required: false,
                    },
                    {
                        id: 'description',
                        label: this.$t('POI.FORM.DESCRIPTION'),
                        required: true,
                        type: 'textarea',
                    },
                    {
                        id: 'route',
                        label: this.$t('POI.FORM.HOW_TO_GET_BY_CAR'),
                        type: 'textarea',
                    },
                    {
                        id: 'route_o',
                        label: this.$t('POI.FORM.HOW_TO_GET_BY_PUBLIC_TRANSPORT'),
                        type: 'textarea',
                    },
                    {
                        id: 'addon',
                        label: this.$t('POI.FORM.ADDON'),
                        type: 'textarea',
                    },
                    {
                        id: 'links',
                        label: this.$t('POI.FORM.LINKS'),
                        type: 'textarea',
                    },
                    {
                        id: 'copyright',
                        label: this.$t('POI.FORM.COPYRIGHT'),
                    },
                    {
                        id: 'ytb',
                        label: 'Youtube: https://www.youtube.com/watch?v=',
                    },
                ],
                form: new Form({
                    name: null,
                    name_en: null,
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
                    if (this.form && this.form.lat && this.form.lng) {
                        return {
                            lat: this.form.lat,
                            lng: this.form.lng,
                        };
                    }
                    return {
                        lat: 33,
                        lng: 45,
                    };
                },
                set() {
                },
            },
            types() {
                return TYPES.map((item) => ({
                    id: item.name,
                    name: this.$t(`CATEGORY.${item.name.toUpperCase()}`),
                }));
            },
            orderedTags() {
                return [...this.tags]
                    .map((item) => ({
                        ...item,
                        name: this.$i18n.locale === 'en' ? item.name_en : item.name,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
            },
        },
        watch: {
            poi(poi) {
                ['name', 'name_en', 'description', 'route', 'route_o', 'addon', 'type', 'lat', 'lng', 'links', 'ytb', 'copyright', 'type']
                    .forEach((field) => {
                        this.form[field] = poi[field];
                    });
                ['tags'].forEach((field) => {
                    this.form[field] = poi[field].map((tag) => tag.id);
                });
            },
        },
        mounted() {
            if (process.client && navigator.geolocation && !(this.poi)) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.form.lat = position.coords.latitude;
                        this.form.lng = position.coords.longitude;
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
                            this.$message.success('Сохранено. Теперь вы можете добавить фото');
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
            filterTags(query) {
                this.filteredTags = this.tags.filter((item) => item.name.includes(query));
            },
        },
    };
</script>

<style scoped>
    .el-select {
        width: 100%;
    }
</style>
