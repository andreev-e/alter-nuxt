<template>
    <div class="row">
        <div class="col-sm-12">
            <h2>{{ id ? 'Отзывы' : 'Последние отзывы' }}</h2>
            <b-spinner
                v-if="loading"
                label="Spinning"
            />
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
            <b-form v-if="id">
                <b-form-group>
                    <b-form-textarea
                        id="text"
                        v-model="form.text"
                        placeholder="Текст комментария"
                        required
                        rows="3"
                        max-rows="6"
                    />
                </b-form-group>
                <b-button
                    type="submit"
                    variant="primary"
                >
                    Отправить
                </b-button>
            </b-form>
        </div>
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Comment from './comments/Comment.vue';

    export default {
        components: { Comment },
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
                form: {
                    text: null,
                },
                page: 1,
            };
        },
        fetch() {
            this.loadComments();
        },
        computed: {
            ...mapGetters({
                loading: 'commentsPaginated/loading',
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
                });
                this.getComments();
            },
        },
    };
</script>

<style>

</style>
