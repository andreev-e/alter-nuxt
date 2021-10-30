<template>
  <div class="content row">
    <div
      class="navigation col-sm-12"
    >
      <ul>
        <li class="first">
          <router-link to="/">
            <img src="https://altertravel.ru/i/first_li.png" alt="First li">
          </router-link>
        </li>
        <li>
          <router-link to="/region">
            Все страны
          </router-link>
        </li>
        <li
          v-for="crumb in list"
          :key="crumb.id"
        >
          <router-link v-if="crumb.url" :to="crumb.url">
            {{ crumb.name }}
          </router-link>
          <span v-else>
            {{ crumb.name }}
          </span>
        </li>
        <li v-if="loading">
          <b-spinner small />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
  }
}
</script>

<style>
  .navigation li {
      list-style-image: url('https://altertravel.ru/i/list_style.png');
      float: left;
      margin-left: 24px;
      font-size: 17px;
  }
  .navigation a {
    color: #27475c;
  }
  .navigation li.first {
    list-style-image: none;
    margin-left: 0;
  }
</style>
