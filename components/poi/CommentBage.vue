<template>
    <badge class="bg-light text-black-50">
        <font-awesome-icon
            v-if="count === 1"
            icon="fa-comment"
        />
        <font-awesome-icon
            v-else
            icon="fa-comments"
        />
        {{ count }}
    </badge>
</template>

<script>
    import Badge from '../ui/Badge.vue';

    export default {
        name: 'CommentBage',
        components: { Badge },
        props: {
            count: { type: Number, required: true },
        },
    };
</script>

<style scoped>

</style>
