<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />

        <div class="row">
            <div class="col-12">
                <form @submit.prevent="onSubmit">
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
    import { TYPES } from '../../../constants';
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import TextInput from '../../../components/ui/TextInput.vue';

    export default {
        components: { TextInput, Breadcrumbs },
        middleware: 'auth',
        data() {
            return {
                center: null,
                form: new Form({
                    name: null,
                    description: null,
                    route: null,
                    route_o: null,
                    addon: null,
                }),
            };
        },
        async fetch() {
            await this.setId(this.$route.params.id);
            await this.get();
            ['name', 'description', 'route', 'route_o', 'addon'].forEach((field) => {
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
                let url = `${this.endpoint}`;
                if (this.isEditMode) {
                    url = `${url}/${this.params.id}`;
                    this.form.addField('_method', 'patch');
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
        },
    };
</script>
