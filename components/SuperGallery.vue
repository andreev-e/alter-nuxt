<template>
    <section>
        <div
            v-for="img in images"
            :key="img.id"
            :style="`width:${img.width*heightOfRow/img.height}px;flex-grow:${img.width*heightOfRow/img.height}`"
        >
            <i :style="`padding-bottom:${img.height/img.width*100}%`" />
            <a :href="img.original">
                <img
                    :src="img.original"
                    :alt="alt"
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
        },
        computed: {
            heightOfRow() {
                return Math.max(900 / this.images.length, 250);
            },
        },
    };
</script>

<style scoped>
  section {
    display: flex;
    flex-wrap: wrap;
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
</style>
