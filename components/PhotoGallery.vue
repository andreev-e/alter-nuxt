<template>
    <div class="d-flex flex-wrap py-3">
        <preview
            v-for="image in images"
            :key="image.id"
            :alt="alt"
            :url="image.preview"
            :full="image.original"
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
        },
    };
</script>

<style scoped>

</style>
