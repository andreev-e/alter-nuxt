<template>
    <div class="row">
        <div class="col-12 mb-2">
            <div class="d-flex flex-wrap">
                <preview
                    v-for="image in images"
                    :key="image.id"
                    :alt="`${image.id}`"
                    :url="image.preview"
                    :full="image.original"
                    can-delete
                    :loading="loading"
                    @delete="remove(image.id)"
                />
                <preview
                    v-if="previewImage"
                    :url="previewImage"
                    loading
                />
            </div>
        </div>
        <div
            v-if="!loading"
            class="col-4"
        >
            <input
                ref="file"
                type="file"
                accept="image/*"
                @change="selectImage"
            >
        </div>
        <div
            v-if="message"
            class="alert alert-secondary"
            role="alert"
        >
            {{ message }}
        </div>
    </div>
</template>

<script>
    import { Form, Request } from 'laravel-request-utils';
    import Preview from '../Preview.vue';

    export default {
        name: 'PhotoForm',
        components: { Preview },
        props: {
            images: { type: Array, false: true, default: () => [] },
            path: { type: String, required: true },
        },
        emits: ['images'],
        data() {
            return {
                form: new Form({
                    image: null,
                    name: null,
                    description: null,
                }),
                message: null,
                currentImage: null,
                previewImage: null,
                loading: false,
            };
        },
        methods: {
            selectImage() {
                this.currentImage = this.$refs.file.files.item(0);
                if (this.currentImage) {
                    this.previewImage = URL.createObjectURL(this.currentImage);
                    this.message = '';
                    this.form.image = this.currentImage;
                    this.upload();
                }
            },
            upload() {
                this.form.submit(`/api/${this.path}/image`)
                    .then((response) => {
                        this.$emit('images', response);
                        this.previewImage = null;
                        this.$refs.file.value = null;
                    })
                    .catch((err) => {
                        this.message = `Ошибка загрузки! ${err}`;
                        this.currentImage = null;
                        this.$refs.file.value = null;
                    });
            },
            remove(id) {
                this.loading = true;
                Request.getInstance().delete(`/api/${this.path}/image/${id}`)
                    .then((response) => {
                        this.$emit('images', response.data);
                        this.loading = false;
                    });
            },
        },
    };
</script>

<style scoped>

</style>
