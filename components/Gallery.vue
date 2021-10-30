<template>
  <div class="row inner-gal gallery">
    <div v-for="poi in objects" :key="poi.id" class="col-sm-4">
      <PoiCard :poi="poi" :loading="loading" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    objects: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
