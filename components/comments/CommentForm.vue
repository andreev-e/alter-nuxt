<template>
    <form>
        <b-form-group>
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
            {{ commentId ? 'Отредактировать' : 'Отправить' }}
        </b-button>
    </form>
</template>

<script>
    import { Form } from 'laravel-request-utils';

    export default {
        name: 'CommentForm',
        props: {
            id: { type: [Number, String], required: false, default: null },
            commentId: { type: Number, required: false, default: null },
            type: { type: String, required: true },
            text: { type: String, required: false, default: '' },
        },
        emits: ['update'],
        data() {
            return {
                form: new Form({
                    comment: this.text,
                }),
            };
        },
        methods: {
            addComment() {
                this.form.addField('id', this.id);
                this.form.addField('type', this.type);
                let url = '/api/comment';
                if (this.commentId) {
                    this.form.addField('_method', 'PATCH');
                    url += `/${this.commentId}`;
                }
                this.form.submit(url).then(() => {
                    this.$emit('update');
                });
            },
        },
    };
</script>

<style scoped>

</style>
