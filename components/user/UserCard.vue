<template>
    <div class="row mb-2">
        <div class="col-1">
            <router-link
                v-if="isAdmin"
                :to="`/secure/user/${user.username}`"
                class="d-inline-block mr-1 mt-1"
                title="Изменить"
            >
                <font-awesome-icon
                    icon="fa-edit"
                    class="text-warning"
                    role="button"
                />
            </router-link>
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
                    alt="empty"
                >
            </nuxt-link>
        </div>
        <div class="col-11">
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
        computed: {
            isAdmin() {
                return this.$auth.user && this.$auth.user.username === 'andreev';
            },
        },
    };
</script>

<style scoped>

</style>
