<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Авторский раздел
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <client-only>
                    <b-tabs>
                        <b-tab
                            title="Точки"
                            class="my-3"
                        >
                            <paginated-gallery type="pois" />
                            <router-link
                                to="/secure/poi/create"
                                class="d-inline-block mr-1 mt-1"
                                title="Добавить достопримечательность"
                            >
                                <font-awesome-icon
                                    icon="fa-plus-circle"
                                    class="text-success"
                                    role="button"
                                />
                                Добавить достопримечательность
                            </router-link>
                        </b-tab>
                        <b-tab
                            title="Маршруты"
                            class="my-3"
                        >
                            <paginated-gallery type="routes" />
                            <router-link
                                to="/secure/route/create"
                                class="d-inline-block mr-1 mt-1"
                                title="Добавить маршрут"
                            >
                                <font-awesome-icon
                                    icon="fa-plus-circle"
                                    class="text-success"
                                    role="button"
                                />
                                Добавить маршрут
                            </router-link>
                        </b-tab>
                    </b-tabs>
                </client-only>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import PaginatedGallery from '../../components/PaginatedGallery.vue';

    export default {
        components: { PaginatedGallery, Breadcrumbs },
        middleware: 'auth',
        data() {
            return {
                breadCrumbs: [
                    {
                        name: 'Авторский раздел',
                        url: '',
                    },
                ],
            };
        },
        head: {
            title: 'Авторский раздел',
        },
    };
</script>

<style>

</style>
