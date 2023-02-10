<template>
    <div class="d-inline mr-2 mb-2 border-1">
        <a
            v-if="full"
            :href="full"
        >
            <img
                class="preview"
                :src="url"
                :alt="alt"
                @click="$emit('click')"
            >
        </a>
        <img
            v-else
            class="preview"
            :src="url"
            :alt="alt"
            @click="$emit('click')"
        >
    </div>
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
                default: null,
            },
            alt: {
                type: String,
                required: true,
            },
        },
        emits: ['click'],
    };
</script>

<style scoped>
  .preview {
    width: 250px;
    height: 250px;
  }
</style>
