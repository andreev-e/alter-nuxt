<template>
    <section ref="container">
        <div
            v-for="row in rows"
            :key="row.key"
            class="gallery-row"
        >
            <div
                v-for="item in row.items"
                :key="item.img.id"
                class="frame"
                :style="{ width: `${item.width}px`, height: `${row.height}px` }"
            >
                <a
                    class="cursor-pointer"
                    @click.prevent="view(item.img)"
                >
                    <div
                        v-if="item.img.copyright"
                        class="position-absolute"
                    >
                        {{ `${$t('AUTHORS.PARTICIPANT')} ${item.img.copyright}` }}
                    </div>
                    <div
                        v-if="item.img.place"
                        class="position-absolute"
                    >
                        {{ item.img.place }}
                    </div>
                    <img
                        :src="item.img.original"
                        :alt="item.img.alt ? item.img.alt : alt"
                        @load="onLoad(item.img, $event)"
                    >
                </a>
            </div>
        </div>
    </section>
</template>

<script>
    // Отступ между фотографиями, px
    const GAP = 6;
    // Ширина контейнера до первого измерения (SSR)
    const DEFAULT_WIDTH = 1110;

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
            // Желаемая высота ряда, как в Google Фото
            maxHeightOfRow: {
                type: Number,
                default: 250,
            },
            // Соотношение сторон по умолчанию (ширина/высота)
            defaultAspectRatio: {
                type: Number,
                default: 1,
            },
        },
        data() {
            return {
                containerWidth: DEFAULT_WIDTH,
                // Реальные размеры загруженных файлов: метаданные API бывают неточны
                natural: {},
            };
        },
        computed: {
            // Раскладка по рядам: фото в ряду одной высоты, ряд заполняет ширину,
            // но фото не увеличивается больше своего реального размера
            rows() {
                const rows = [];
                const maxWidth = Math.max(this.containerWidth, 1);
                let current = [];
                let ratioSum = 0;

                const flush = (isLast) => {
                    const gaps = GAP * (current.length - 1);
                    let height = (maxWidth - gaps) / ratioSum;
                    if (isLast) {
                        height = Math.min(height, this.maxHeightOfRow);
                    }
                    const nativeLimit = Math.min(...current.map((i) => i.nativeHeight));
                    height = Math.min(height, nativeLimit);
                    rows.push({
                        key: current[0].img.id,
                        height,
                        items: current.map((i) => ({
                            img: i.img,
                            width: height * i.ratio,
                        })),
                    });
                    current = [];
                    ratioSum = 0;
                };

                this.images.forEach((img) => {
                    const size = this.getSize(img);
                    const ratio = size ? size.width / size.height : this.defaultAspectRatio;
                    current.push({
                        img,
                        ratio,
                        nativeHeight: size ? size.height : Infinity,
                    });
                    ratioSum += ratio;
                    const gaps = GAP * (current.length - 1);
                    if ((maxWidth - gaps) / ratioSum <= this.maxHeightOfRow) {
                        flush(false);
                    }
                });
                if (current.length) {
                    flush(true);
                }
                return rows;
            },
        },
        mounted() {
            this.measure();
            if (typeof ResizeObserver !== 'undefined') {
                this.observer = new ResizeObserver(() => this.measure());
                this.observer.observe(this.$refs.container);
            } else {
                window.addEventListener('resize', this.measure);
            }
            // Картинки из кэша могут загрузиться до гидрации без события load
            this.$el.querySelectorAll('img').forEach((el) => {
                if (el.complete && el.naturalWidth) {
                    const img = this.images.find((i) => i.original === el.getAttribute('src'));
                    if (img) {
                        this.onLoad(img, { target: el });
                    }
                }
            });
        },
        // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle -- проект на Vue 2
        beforeDestroy() {
            if (this.observer) {
                this.observer.disconnect();
            } else {
                window.removeEventListener('resize', this.measure);
            }
        },
        methods: {
            measure() {
                if (this.$refs.container && this.$refs.container.clientWidth) {
                    this.containerWidth = this.$refs.container.clientWidth;
                }
            },
            getSize(img) {
                const natural = this.natural[img.id];
                if (natural) {
                    return natural;
                }
                if (img.width > 0 && img.height > 0) {
                    return { width: img.width, height: img.height };
                }
                return null;
            },
            onLoad(img, event) {
                const { naturalWidth, naturalHeight } = event.target;
                const known = this.natural[img.id];
                if (naturalWidth && naturalHeight
                    && (!known || known.width !== naturalWidth || known.height !== naturalHeight)) {
                    this.$set(this.natural, img.id, { width: naturalWidth, height: naturalHeight });
                }
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
    .gallery-row {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;
    }

    .frame {
        flex: none;
        background-color: #606084;
        position: relative;
        overflow: hidden;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        top: 0;
        right: 0;
        z-index: 2;
        opacity: 0.8;
        padding: 3px 10px;
    }
</style>
