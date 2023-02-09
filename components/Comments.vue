<template>
    <div
        id="comments"
        class="row"
    >
        <div class="col-sm-12">
            <h2>{{ id ? 'Отзывы' : 'Последние отзывы' }}</h2>
            <div
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
                    @reload="loadComments"
                />
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
            <form v-if="id">
                <b-form-group>
                    <text-input
                        v-if="!$auth.user"
                        v-model="form.email"
                        label="Email"
                        required
                    />
                    <b-form-textarea
                        id="comment"
                        v-model="form.comment"
                        placeholder="Текст комментария"
                        required
                        rows="3"
                        max-rows="6"
                    />
                </b-form-group>
                <b-button
                    variant="primary"
                    @click.stop="addComment"
                >
                    Отправить
                </b-button>
            </form>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import { Form } from 'laravel-request-utils';
    import Comment from './comments/Comment.vue';
    import TextInput from './ui/TextInput.vue';

    export default {
        components: { TextInput, Comment },
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
                form: new Form({
                    comment: '',
                    email: '',
                }),
                page: 1,
            };
        },
        fetch() {
            this.loadComments();
        },
        computed: {
            ...mapGetters({
                comments: 'commentsPaginated/items',
                meta: 'commentsPaginated/meta',
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
            loadComments() {
                this.clear();
                this.setParams({
                    id: this.id,
                    type: this.type,
                    page: this.page,
                    pending: this.$auth.user && this.$auth.user.username === 'andreev',
                });
                this.getComments();
                this.form.addField('id', this.id);
                this.form.addField('type', this.type);
            },
            addComment() {
                this.form.submit('/api/comment').then(() => {
                    this.getComments();
                });
            },
        },
    };
</script>
