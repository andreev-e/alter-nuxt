<template>
    <div
        class="text-dark"
        :class="{ 'text-muted': comment.approved ===0 }"
    >
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
            <font-awesome-icon
                v-if="false"
                icon="fa-edit"
            />
            <font-awesome-icon
                v-if="$auth.user && ($auth.user.username === 'andreev' || $auth.user.username === comment.user.username)"
                icon="fa-trash"
                role="button"
                @click="del(comment.commentid)"
            />
            <font-awesome-icon
                v-if="$auth.user && $auth.user.username === 'andreev'"
                icon="fa-check"
                role="button"
                @click="approve(comment.commentid)"
            />
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
    import { Request } from 'laravel-request-utils';

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
        emits: ['reload'],
        methods: {
            del(id) {
                Request.getInstance().delete(`/api/comment/${id}`).then(() => {
                    this.$emit('reload');
                });
            },
            approve(id) {
                Request.getInstance().post(`/api/comment/${id}/approve`).then(() => {
                    this.$emit('reload');
                });
            },
        },
    };
</script>

<style scoped>

</style>
