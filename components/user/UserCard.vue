<template>
    <div class="row">
        <div class="col-2">
            <nuxt-link :to="`/user/${user.username}`">
                <img
                    v-if="user.thumb"
                    class="img-fluid"
                    :src="user.thumb"
                    :alt="user.username"
                >
                <img
                    v-else
                    src="https://via.placeholder.com/600"
                    class="img-fluid"
                    :alt="empty"
                >
            </nuxt-link>
        </div>
        <div class="col-10">
            <div class="info_title">
                <nuxt-link :to="`/user/${user.username}`">
                    {{ user.firstname }}
                    {{ user.lastname }}
                    (опубликовано {{ user.publications }}, с нами с {{ user.regdate }})
                </nuxt-link>
            </div>
            <div
                v-if="user.about"
                class="description"
            >
                <p>
                    {{ user.about }}
                </p>
            </div>
        </div>
        <hr>
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
    };
</script>

<style scoped>

</style>
