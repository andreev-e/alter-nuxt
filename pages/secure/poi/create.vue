<template>
    <div class="container page">
        <Header />
        <Breadcrumbs :list="breadCrumbs" />
        <div class="row">
            <div class="col-12">
                <h1>{{ $t('POI.CREATE') }}</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <client-only>
                    <poi-form />
                </client-only>
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
        middleware: 'auth',
        data() {
            return {
                breadCrumbs: [
                    {
                        name: this.$t('SECURE.TITLE'),
                        url: '/secure/',
                    },
                    {
                        name: this.$t('POI.CREATE'),
                        url: '',
                    },
                ],
            };
        },
        head() {
            return {
                title: this.$t('POI.CREATE'),
            };
        },
    };
</script>

<style scoped>

</style>
