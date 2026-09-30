<template>
    <!-- Флаг картинкой с CDN: библиотека vue-country-flag добавляла в бандл спрайт всех стран на 300 КБ -->
    <img
        :src="src(1)"
        :srcset="`${src(2)} 2x`"
        :width="dimensions.width"
        :height="dimensions.height"
        alt=""
        loading="lazy"
        class="country-flag"
    >
</template>

<script>
    const SIZES = {
        small: { width: 16, height: 12 },
        normal: { width: 32, height: 24 },
    };

    export default {
        name: 'CountryFlag',
        props: {
            country: {
                type: String,
                required: true,
            },
            size: {
                type: String,
                default: 'normal',
            },
        },
        computed: {
            dimensions() {
                return SIZES[this.size] || SIZES.normal;
            },
        },
        methods: {
            src(scale) {
                const { width, height } = this.dimensions;
                return `https://flagcdn.com/${width * scale}x${height * scale}/${this.country.toLowerCase()}.png`;
            },
        },
    };
</script>

<style scoped>
  .country-flag {
    vertical-align: baseline;
  }
</style>
