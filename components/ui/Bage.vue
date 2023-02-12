<template>
    <nuxt-link
        v-if="url"
        :to="url"
        class="cursor-pointer d-inline rounded py-0.5 px-1 mr-2 mb-1 text-white"
        style="text-decoration: none"
    >
        <slot />
    </nuxt-link>
    <div
        v-else
        class="d-inline rounded py-0.5 px-1 mr-2 mb-1"
    >
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'Bage',
        props: {
            url: { type: String, default: null },
        },
    };
</script>

<style scoped>

</style>
