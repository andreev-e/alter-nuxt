<template>
    <a :href="full">
        <img
            class="preview"
            :src="url"
            :alt="alt"
        >
    </a>
</template>

<script>
    export default {
        name: 'Preview',
        props: {
            url: {
                type: String,
                required: true,
            },
            full: {
                type: String,
                required: false,
                default: '',
            },
            alt: {
                type: String,
                required: true,
            },
        },
    };
</script>

<style scoped>
  .preview {
    width: 100px;
    height: 100px;
  }
</style>
