<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>Создание</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <poi-form />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    import Breadcrumbs from '../../../components/Breadcrumbs.vue';
    import PoiForm from '../../../components/forms/PoiForm.vue';

    export default {
        name: 'Create',
        components: {
            PoiForm,
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
                        name: 'Создание достпоримечательности',
                        url: '',
                    },
                ],
            };
        },
    };
</script>

<style scoped>

</style>
