<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>Создание маршрута</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <route-form />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import RouteForm from '../../../components/forms/RouteForm.vue';

    export default {
        name: 'Create',
        components: {
            RouteForm,
            Breadcrumbs,
        },
        data() {
            return {
                breadCrumbs: [
                    {
                        name: 'Авторский раздел',
                        url: '/secure/',
                    },
                    {
                        name: 'Создание маршрута',
                        url: '',
                    },
                ],
            };
        },
    };
</script>

<style scoped>

</style>
