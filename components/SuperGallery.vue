<template>
    <section>
        <div
            v-for="img in images"
            :key="img.id"
            class="frame"
            :style="frameStyle(img)"
        >
            <i :style="paddingStyle(img)" />
            <a
                class="cursor-pointer"
                @click.prevent="view(img)"
            >
                <div
                    v-if="img.copyright"
                    class="position-absolute"
                >
                    {{ `${$t('AUTHORS.PARTICIPANT')} ${img.copyright}` }}
                </div>
                <div
                    v-if="img.place"
                    class="position-absolute"
                >
                    {{ img.place }}
                </div>
                <img
                    :src="img.original"
                    :alt="img.alt ? img.alt : alt"
                >
            </a>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'SuperGallery',
        props: {
            images: {
                type: Array,
                default: () => [],
            },
            alt: {
                type: String,
                default: '',
            },
            dominateColor: {
                type: String,
                default: '',
            },
            maxHeightOfRow: {
                type: Number,
                default: 250,
            },
            // Новый проп – соотношение сторон по умолчанию (ширина/высота)
            defaultAspectRatio: {
                type: Number,
                default: 1, // 1:1
            },
        },
        computed: {
            heightOfRow() {
                return Math.max(900 / this.images.length, this.maxHeightOfRow);
            },
        },
        methods: {
            // Возвращает соотношение сторон для конкретного изображения
            getAspectRatio(img) {
                if (img.width && img.height && img.width > 0 && img.height > 0) {
                    return img.width / img.height;
                }
                return this.defaultAspectRatio;
            },
            // Стили для контейнера .frame
            frameStyle(img) {
                const ratio = this.getAspectRatio(img);
                const width = this.heightOfRow * ratio;
                return {
                    width: `${width}px`,
                    flexGrow: `${width}`,
                };
            },
            // Стили для псевдо-элемента i (padding-bottom для сохранения пропорций)
            paddingStyle(img) {
                const ratio = this.getAspectRatio(img);
                const paddingBottom = (1 / ratio) * 100;
                return {
                    paddingBottom: `${paddingBottom}%`,
                };
            },
            view(img) {
                if (img.href) {
                    this.$router.push(img.href);
                } else {
                    this.$msgbox({
                        dangerouslyUseHTMLString: true,
                        message: `<div style="background-color: ${
                            this.dominateColor ? this.dominateColor : '#606084'
                        }"><img class="img-fluid" src="${img.original}"></div>`,
                        showConfirmButton: false,
                        center: true,
                        lockScroll: false,
                        customClass: 'show-photo',
                        closeOnClickModal: true,
                    }).catch(() => {
                    });
                }
            },
        },
    };
</script>

<style scoped>
    section {
        display: flex;
        flex-wrap: wrap;
        margin: -3px;
    }

    section::after {
        content: "";
        flex-grow: 999999999;
    }

    .frame {
        margin: 3px;
        background-color: #606084;
        position: relative;
        overflow: hidden; /* чтобы обрезать выступающие части при object-fit: cover */
    }

    i {
        display: block;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover; /* заполняет контейнер без искажений */
        vertical-align: bottom;
    }

    .frame .position-absolute {
        display: none;
    }

    .frame:hover .position-absolute {
        display: block;
    }

    .position-absolute {
        background-color: #ffffff;
        color: #244255;
        top: -3px;
        right: -3px;
        z-index: 2;
        opacity: 0.8;
        padding: 3px 10px;
    }
</style>
