<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    <router-link
                        to="/secure/poi/create"
                        class="d-inline-block mr-2 mt-1"
                        title="Добавить достопримечательность"
                    >
                        <font-awesome-icon
                            icon="fa-map-marker"
                            class="text-primary"
                            role="button"
                        />
                    </router-link>
                    <router-link
                        to="/secure/route/create"
                        class="d-inline-block mr-2 mt-1"
                        title="Добавить маршрут"
                    >
                        <font-awesome-icon
                            icon="fa-route"
                            class="text-primary"
                            role="button"
                        />
                    </router-link>
                    Авторский раздел
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <b-tabs>
                    <b-tab
                        title="Точки"
                        class="my-3"
                    >
                        <client-only>
                            <paginated-gallery
                                type="poi"
                                name="точку"
                            />
                        </client-only>
                    </b-tab>
                    <b-tab
                        title="Маршруты"
                        class="my-3"
                    >
                        <client-only>
                            <paginated-gallery
                                type="route"
                                name="маршрут"
                            />
                        </client-only>
                    </b-tab>
                </b-tabs>
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
