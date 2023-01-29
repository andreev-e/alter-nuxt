<template>
    <div class="comment">
        <div class="author-date">
            <b>
                <router-link
                    v-if="comment.user"
                    :to="'/user/' + comment.user.username"
                >
                    {{ comment.user.firstname }} {{ comment.user.lastname }}</router-link>
                <a
                    v-else-if="comment.email"
                    href="mailto:"
                >{{ comment.name }}</a>
                <span v-else>{{ comment.name }}
                </span>
            </b>
            <i>{{ $moment(comment.time * 1000).format('LLLL') }}</i>
            <router-link
                v-if="linkObjects"
                :to="'/poi/' + comment.backlink"
            >
                об объекте
                {{ comment.object_name }}
            </router-link>
        </div>
        <div class="comment-text-wrapper">
            <div class="comment-text">
                <p>{{ comment.comment }}</p>
            </div>
        </div>
        <hr v-if="index !== total - 1">
    </div>
</template>

<script>
    export default {
        name: 'Comment',
        props: {
            comment: {
                type: Object,
                required: true,
            },
            index: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
            linkObjects: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
    };
</script>

<style scoped>

</style>
