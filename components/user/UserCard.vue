<template>
    <div class="col-2">
        <nuxt-link :to="`/user/${user.username}`">
            <img
                v-if="user.thumb"
                class="img-fluid"
                :src="user.thumb"
                :alt="user.username"
            >
            <div class="above_img">
                {{ user.name }}
            </div>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        name: 'UserCard',
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        computed: {
            isAdmin() {
                return this.$auth.user && this.$auth.user.username === 'andreev';
            },
        },
    };
</script>

<style scoped>
  .above_img {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    margin-top: 90%;
    margin-left: -15px;
    text-align: center;
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0.9);
  }
</style>
