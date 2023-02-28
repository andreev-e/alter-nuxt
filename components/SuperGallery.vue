<template>
    <section>
        <div
            v-for="img in images"
            :key="img.id"
            class="frame"
            :style="`width:${img.width*heightOfRow/img.height}px;flex-grow:${img.width*heightOfRow/img.height}`"
        >
            <i :style="`padding-bottom:${img.height/img.width*100}%`" />
            <a
                style="cursor:pointer"
                @click.prevent="view(img)"
            >
                <div
                    v-if="img.copyright"
                    class="position-absolute"
                >
                    {{ img.copyright ? `Автор ${img.copyright}`: '' }}
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
        },
        computed: {
            heightOfRow() {
                return Math.max(900 / this.images.length, 250);
            },
        },
        methods: {
            view(img) {
                if (img.href) {
                    window.open(img.href);
                } else {
                    this.$alert('', '', '',
                                {
                                    imageUrl: img.original,
                                    width: '100%',
                                    padding: 0,
                                    background: this.dominateColor ? this.dominateColor : '#606084',
                                    showConfirmButton: false,
                                    showCloseButton: true,
                                    animation: false,
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
    content: '';
    flex-grow: 999999999;
  }

  div {
    margin: 3px;
    background-color: #606084;
    position: relative;
  }

  i {
    display: block;
  }

  img {
    position: absolute;
    top: 0;
    width: 100%;
    vertical-align: bottom;
  }

  .frame .position-absolute {
    display: none;
  }

  .frame:hover .position-absolute {
    display: block;
  }

  .position-absolute {
    background-color: #FFFFFF;
    color: #244255;
    top: -3px;
    right: -3px;
    z-index: 2;
    opacity: 0.8;
    padding: 3px 10px;
  }
</style>
