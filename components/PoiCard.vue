<template>
    <nuxt-link
        :to="'/poi/' + poi.id"
        class="poi__card"
    >
        <div :class="loading ? 'poi_card loading' : 'poi__content'">
            <div
                v-if="loading"
                class="spinner"
            >
                <b-spinner />
            </div>
            <img
                :src="'https://altertravel.ru/thumb.php?f=/images/' + poi.id + '.jpg'"
                class="img-fluid"
                :alt="poi.name"
            >
            <div class="img-title">
                {{ poi.name }}
            </div>
        </div>
    </nuxt-link>
</template>

<script>
    export default {
        name: 'PoiCard',
        props: {
            poi: {
                type: Object,
                required: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style>
  .loading {
    opacity: 0.4;
  }
  .spinner {
    width:100%;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: rgba(255,255,255, 0.5);
  }
  .poi__card {
    display: block;
    padding: 15px 0;
  }
  .poi__content {
    position: relative;
  }
  .img-title {
    opacity: 0.9;
    background: #7495AA;
    color: #FFF;
    height: 45px;
    font-size: 18px;
    text-align: center;
    z-index: 1;
    padding: 0;
    box-shadow: 0 4px 4px -4px rgb(0 0 0);
    overflow: hidden;
    line-height: 22px;
    border: 1px solid #000;
  }
</style>
