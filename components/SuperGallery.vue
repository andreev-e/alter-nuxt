<template>
    <section>
        <div
            v-for="img in images"
            :key="img.id"
            :style="`width:${img.width*275/img.height}px;flex-grow:${img.width*275/img.height}`"
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
    margin: 2px;
    background-color: violet;
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
