<template>
    <div
        v-if="user.checkins && user.checkins.length"
        class="row"
    >
        <div class="col-12">
            <h2>Побывал в</h2>
        </div>
        <div class="col-12">
            <checkins :user="user" />
        </div>
    </div>
</template>

<script>
    import Checkins from '../poi/Checkins.vue';

    export default {
        name: 'UserCheckins',
        components: { Checkins },
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
    };
</script>

<style scoped>

</style>
