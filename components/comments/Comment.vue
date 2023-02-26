<template>
    <div
        class="text-dark"
        :class="{ 'text-muted': !comment.approved }"
    >
        <div class="author-date">
            <font-awesome-icon
                v-if="canApprove"
                icon="fa-check"
                role="button"
                @click="approve(comment.commentid)"
            />
            <b>
                <router-link
                    v-if="comment.user"
                    :to="'/user/' + comment.user.username"
                >
                    {{
                        comment.user.firstname || comment.user.lastname ? `${comment.user.firstname} ${comment.user.lastname}` : comment.user.username
                    }}
                </router-link>
                <a
                    v-else-if="comment.email"
                    href="mailto:"
                >{{ comment.name }}</a>
                <span v-else>{{ comment.name }}
                </span>
            </b>
            <i>{{ $moment(comment.created_at).format('LLLL') }}</i>
            <router-link
                v-if="linkObjects"
                :to="`${type ? type : comment.object_type}/${comment.object_id}`"
            >
                об объекте
                {{ comment.object_name }}
            </router-link>
            <client-only>
                <font-awesome-icon
                    v-if="canEdit"
                    icon="fa-edit"
                    role="button"
                    @click="edit(comment.commentid)"
                />
                <font-awesome-icon
                    v-if="canEdit"
                    icon="fa-trash"
                    role="button"
                    @click="del(comment.commentid)"
                />
            </client-only>
        </div>
        <comment-form
            v-if="editing"
            :id="comment.backlink"
            :comment-id="comment.commentid"
            :text="comment.comment"
            :type="type"
            @update="$emit('reload')"
        />
        <div
            v-else
            class="comment-text-wrapper"
        >
            <div class="comment-text">
                <p>{{ comment.comment }}</p>
            </div>
        </div>
        <hr v-if="index !== total - 1">
    </div>
</template>

<script>
    import { Request } from 'laravel-request-utils';
    import CommentForm from './CommentForm.vue';

    export default {
        name: 'Comment',
        components: { CommentForm },
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
            type: {
                type: String,
                required: true,
            },
        },
        emits: ['reload'],
        data() {
            return {
                editing: false,
            };
        },
        computed: {
            isAdmin() {
                return process.client && this.$auth.user && this.$auth.user.username === 'andreev';
            },
            canApprove() {
                return process.client && !this.comment.approved && this.isAdmin;
            },
            canEdit() {
                return process.client
                    && this.$auth.user
                    && (this.$auth.user.username === 'andreev'
                        || (this.comment.user && this.$auth.user.username === this.comment.user.username));
            },
        },
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
            edit() {
                this.editing = true;
            },
        },
    };
</script>

<style scoped>

</style>
