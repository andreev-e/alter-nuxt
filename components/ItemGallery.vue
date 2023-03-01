<template>
    <div class="row inner-gal gallery">
        <div
            v-for="poi in objects"
            :key="poi.id"
            :class="small ? 'col-md-2 col-6 col-sm-3' : 'col-md-4 col-12 col-sm-6'"
        >
            <PoiCard
                :poi="poi"
                :loading="loading"
                :type="type"
                @reload="$emit('reload')"
            />
        </div>
    </div>
</template>

<script>
    import PoiCard from './PoiCard.vue';

    export default {
        name: 'ItemGallery',
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
            small: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['reload'],
    };
</script>

<style>

</style>
