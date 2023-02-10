<template>
    <div>
        <preview
            v-for="image in images"
            :key="image.id"
            :alt="`${image.id}`"
            :url="image.preview"
            :full="image.full"
            role="button"
            @click="remove(image.id)"
        />
        <input
            ref="file"
            type="file"
            accept="image/*"
            @change="selectImage"
        >
        <div class="col-4">
            <button
                class="btn btn-success btn-sm float-right"
                :disabled="!currentImage"
                @click="upload"
            >
                Загрузить
            </button>
        </div>

        <div
            v-if="currentImage"
            class="progress"
        >
            <div
                class="progress-bar progress-bar-info"
                role="progressbar"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: progress + '%' }"
            >
                {{ progress }}%
            </div>
        </div>

        <div v-if="previewImage">
            <div>
                <img
                    class="preview my-3 w-25"
                    :src="previewImage"
                    alt=""
                >
            </div>
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
                progress: 0,
            };
        },
        methods: {
            selectImage() {
                this.currentImage = this.$refs.file.files.item(0);
                if (this.currentImage) {
                    this.previewImage = URL.createObjectURL(this.currentImage);
                    this.progress = 0;
                    this.message = '';
                    this.form.image = this.currentImage;
                }
            },
            upload() {
                this.progress = 30;

                this.form.submit(`/api/${this.path}/image`)
                    .then((response) => {
                        this.$emit('images', response);
                        this.progress = 0;
                        this.previewImage = null;
                    })
                    .catch((err) => {
                        this.progress = 0;
                        this.message = `Ошибка загрузки! ${err}`;
                        this.currentImage = null;
                    });
            },
            remove(id) {
                Request.getInstance().delete(`/api/${this.path}/image/${id}`)
                    .then((response) => {
                        this.$emit('images', response);
                    });
            },
        },
    };
</script>

<style scoped>

</style>
