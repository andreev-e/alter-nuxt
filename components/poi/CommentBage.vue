<template>
    <bage class="bg-light text-black-50">
        <font-awesome-icon
            v-if="count === 1"
            icon="fa-comment"
        />
        <font-awesome-icon
            v-else
            icon="fa-comments"
        />
        {{ count }}
    </bage>
</template>

<script>
    import Bage from '../ui/Bage.vue';

    export default {
        name: 'CommentBage',
        components: { Bage },
        props: {
            count: { type: Number, required: true },
        },
    };
</script>

<style scoped>

</style>
