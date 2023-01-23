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
    import Comment from '@/components/comments/Comment.vue';

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
                comments: [],
                loading: true,
                form: {
                    text: null,
                },
            };
        },
        async fetch() {
            await this.fetchComments();
        },
        computed: {
            filteredComments() {
                return this.last ? this.comments.splice(0, this.last) : this.comments;
            },
        },
        mounted() {
            this.fetchComments();
        },
        methods: {
            async fetchComments() {
                this.loading = true;
                const result = await this.$axios.$get(
                    'https://api.altertravel.ru/api/comment',
                    {
                        params: {
                            id: this.id,
                            type: this.type,
                        },
                    },
                );
                this.comments = result.data;
                this.loading = false;
            },
        },
    };
</script>

<style>

</style>
