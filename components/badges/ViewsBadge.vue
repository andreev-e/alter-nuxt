<template>
    <badge class="bg-secondary text-white">
        <font-awesome-icon
            icon="icon fa-eye"
        />
        {{ views }}
    </badge>
</template>

<script>
    import Badge from '../ui/Badge.vue';

    export default {
        name: 'ViewsBadge',
        components: { Badge },
        props: {
            views: {
                type: Number,
                default: 0,
            },
        },
    };
</script>

<style scoped>
  .icon {
    max-height: 18px;
  }
</style>
