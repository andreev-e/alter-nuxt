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
                <b-tabs>
                    <b-tab
                        title="Точки"
                        class="my-3"
                    >
                        <client-only>
                            <paginated-gallery
                                type="pois"
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
                                type="routes"
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
