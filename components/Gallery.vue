<template>
    <div class="row inner-gal gallery">
        <div
            v-for="poi in objects"
            :key="poi.id"
            class="col-sm-3"
        >
            <PoiCard
                :poi="poi"
                :loading="loading"
                :type="type"
            />
        </div>
    </div>
</template>

<script>
    import PoiCard from './PoiCard.vue';

    export default {
        components: { PoiCard },
        props: {
            objects: {
                type: Array,
                required: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'poi',
            },
        },
    };
</script>

<style>

</style>
