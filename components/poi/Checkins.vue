<template>
    <div>
        <super-gallery
            v-if="poi.checkins && poi.checkins.length"
            :images="images"
        />
    </div>
</template>

<script>
    import SuperGallery from '../SuperGallery.vue';

    export default {
        name: 'Checkins',
        components: { SuperGallery },
        props: {
            poi: {
                type: Object,
                required: true,
            },
        },
        computed: {
            images() {
                return this.poi.checkins.map((checkin) => checkin.user.images[0])
                    .filter((item) => item);
            },
        },
    };
</script>

<style scoped>

</style>
