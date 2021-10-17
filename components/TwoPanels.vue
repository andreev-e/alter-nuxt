<template>
  <b-row>
    <b-col v-if="left.length">
      <b>Выберите регион</b>
      <ul class="additional_cities">
        <li v-for="child in left" :key="child.id">
          <nuxt-link :to="child.url">
            {{ child.name }}
          </nuxt-link>
        </li>
      </ul>
    </b-col>
    <b-col v-if="right.length">
      <b>Объекты по видам</b>
      <ul class="pravaya_kolonka">
        <li v-for="child in right" :key="child.id">
          <nuxt-link :to="child.url">
            {{ child.name }}
          </nuxt-link>
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'TwoPanels',
  props: {
    left: {
      type: Array,
      required: false,
      default: () => []
    },
    right: {
      type: Array,
      required: false,
      default: () => []
    }
  }
}
</script>

<style>
  .additional_cities li a, .additional_cities_more li a, .pravaya_kolonka li a, .pravaya_kolonka_more li a {
      color: #FFF;
      text-decoration: none;
  }
  .additional_cities li, .additional_cities_more li, .pravaya_kolonka li, .pravaya_kolonka_more li {
    background: #7495AA;
    color: #fff;
    float: left;
    border: 1px solid #7495AA;
    border-radius: 3px;
    margin-right: 3px;
    margin-bottom: 3px;
    padding: 1px;
    cursor: pointer;
    font-size:14px;
  }
</style>
