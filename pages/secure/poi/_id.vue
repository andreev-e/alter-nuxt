<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
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
                    <button
                        type="submit"
                        class="btn btn-success"
                    >
                        Сохранить
                    </button>
                </form>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { Form } from 'laravel-request-utils';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import TextInput from '../../../components/ui/TextInput.vue';
    // eslint-disable-next-line import/extensions
    import { TYPES } from '../../../constants/index.js';
    import SelectInput from '../../../components/ui/SelectInput.vue';

    export default {
        components: { SelectInput, TextInput, Breadcrumbs },
        middleware: 'auth',
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
                }),
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
            ['name', 'description', 'route', 'route_o', 'addon', 'type'].forEach((field) => {
                this.form[field] = this.poi[field];
            });
        },
        head() {
            return {
                title: this.poi.name,
                meta: [
                    {
                        name: 'description',
                        content: 'todo',
                    },
                ],
            };
        },
        computed: {
            ...mapGetters({
                poi: 'poi/model',
                loaded: 'poi/isEmpty',
                endpoint: 'poi/endpoint',
            }),
            center: {
                get() {
                    if (this.poi) {
                        return { lat: this.poi.lat, lng: this.poi.lng };
                    }
                    return { lat: 0, lng: 0 };
                },
                set(val) {
                    this.form.lat = val.lat;
                    this.form.lng = val.lng;
                },
            },
            types() {
                return TYPES;
            },
            breadCrumbs() {
                return [
                    {
                        name: 'Авторский раздел',
                        url: '/secure/',
                    },
                    {
                        name: `Редактирование: ${this.poi.name}`,
                        url: '',
                    },
                ];
            },
        },
        methods: {
            ...mapActions({
                get: 'poi/get',
                setId: 'poi/setId',
            }),
            onSubmit() {
                let url = '/api/poi';
                if (this.$route.params.id) {
                    url = `${url}/${this.$route.params.id}`;
                    this.form.addField('_method', 'PATCH');
                }

                this.form.submit(url)
                    .then((data) => {
                        this.setData(data);
                        this.closeSlide();
                    })
                    .finally(() => {
                        this.disableLoading();
                        this.$router.push({ name: 'company.accounts' });
                    });
            },
            markerMoved(e) {
                this.center = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            },
        },
    };
</script>
