<template>
  <nuxt-link :to="'/poi/' + poi.id" class="poi_card">
    <img :src="'https://altertravel.ru/thumb.php?f=/images/' + poi.id + '.jpg'" :title="poi.name" class="img-fluid">
    <div class="img-title">
      {{ poi.name }}
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'PoiCard',
  props: {
    poi: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
  .poi_card {
    display: block;
    padding: 15px 0;
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
  }
</style>
