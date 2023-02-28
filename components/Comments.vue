<template>
    <div
        id="comments"
        class="row"
    >
        <div class="col-sm-12">
            <h2>{{ id ? 'Отзывы' : 'Последние отзывы' }}</h2>
            <template v-if="!loading">
                <div
                    v-if="filteredComments.length"
                    id="comments_list"
                    class="comments-list"
                >
                    <comment
                        v-for="(comment, index) in filteredComments"
                        :key="comment.id"
                        class="comment"
                        :comment="comment"
                        :index="index"
                        :total="comments.length"
                        :link-objects="linkObjects"
                        :type="comment.object_type"
                        @reload="loadComments"
                    />
                </div>
                <div
                    v-else
                    class="text-center"
                >
                    Пока нет ни одного комментария
                </div>
            </template>
            <div
                v-else
                class="text-center"
            >
                <b-spinner small />
            </div>
            <div class="row">
                <div class="col-12">
                    <b-pagination
                        v-if="meta.last_page > 1 && !last"
                        v-model="page"
                        :total-rows="meta.total"
                        :per-page="meta.per_page"
                        aria-controls="my-table"
                    />
                </div>
            </div>
            <comment-form
                v-if="$auth.loggedIn && id"
                :id="id"
                :type="type"
                @update="getComments"
            />
            <div
                v-if="!$auth.loggedIn"
                class="text-center"
            >
                Чтобы написать комментарий - <nuxt-link to="/secure/">
                    войдите
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Comment from './comments/Comment.vue';
    import CommentForm from './comments/CommentForm.vue';

    export default {
        components: {
            CommentForm,
            Comment,
        },
        props: {
            id: {
                type: [Number, String],
                required: false,
                default: null,
            },
            type: {
                type: String,
                required: false,
                default: null,
            },
            linkObjects: {
                type: Boolean,
                required: false,
                default: false,
            },
            last: {
                type: Number,
                required: false,
                default: null,
            },
        },
        data() {
            return {
                page: 1,
            };
        },
        async fetch() {
            await this.loadComments();
        },
        computed: {
            ...mapGetters({
                comments: 'commentsPaginated/items',
                meta: 'commentsPaginated/meta',
                loading: 'commentsPaginated/loading',
            }),
            filteredComments() {
                return this.last ? [...this.comments].splice(0, this.last) : this.comments;
            },
        },
        watch: {
            page() {
                this.loadComments();
            },
        },
        methods: {
            ...mapActions({
                clear: 'commentsPaginated/clear',
                getComments: 'commentsPaginated/get',
                setParams: 'commentsPaginated/setParams',
            }),
            async loadComments() {
                await this.setParams({
                    id: this.id,
                    type: this.type,
                    page: this.page,
                    pending: this.$auth.user && this.$auth.user && this.$auth.user.username === 'andreev',
                });
                await this.getComments();
            },
        },
    };
</script>
