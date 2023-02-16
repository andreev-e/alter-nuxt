<template>
    <div class="d-flex flex-wrap py-3">
        <preview
            v-for="image in images"
            :key="image.id"
            :alt="alt"
            :url="full ? image.original : image.preview"
            :full="!full ? image.original : null"
        />
    </div>
</template>

<script>
    import Preview from './Preview.vue';

    export default {
        name: 'PhotoGallery',
        components: { Preview },
        props: {
            images: {
                type: Array,
                default: () => [],
            },
            alt: {
                type: String,
                default: '',
            },
            full: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style scoped>

</style>
