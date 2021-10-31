<!-- Please remove this file from your project -->
<template>
  <div class="header-menu col-sm-9">
    <ul>
      <li class="region_select">
        <a href="#">
          Регион
          <span>выбрать</span>
        </a>
        <ul>
          <li
            v-for="region in regions"
            :key="region.id"
          >
            <nuxt-link :to="region.url">
              <img v-if="region.flag" width="16" height="16" :src="`https://altertravel.ru/i/flags/` + region.flag" alt="flag">
              {{ region.name }} ({{ region.count }})
            </nuxt-link>
          </li>
        </ul>
      </li>
      <li class="region_select">
        <a href="#">
          Метки
          <span>выбрать</span>
        </a>
        <ul>
          <li
            v-for="tag in tags"
            :key="tag.id"
          >
            <nuxt-link :to="tag.url">
              {{ tag.name }} ({{ tag.count }})
            </nuxt-link>
          </li>
        </ul>
      </li>
      <li>
        <a href="/catalog/">
          Популярные
          <span>в августе</span>
        </a>
      </li>
      <li>
        <a href="/catalog/?order=order">
          Новые
          <span>места</span>
        </a>
      </li>
      <li>
        <a href="/catalog/?order=order">
          Маршруты
          <span>Готовые треки</span>
        </a>
      </li>
      <li>
        <a href="/catalog/?order=order">
          Планирование
          <span>строим маршрут с точками</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Menu',
  components: {},
  data () {
    return {
      tags: [],
      regions: []
    }
  },
  async fetch () {
    if (process.client) {
      let tags = []
      if (localStorage.tags) {
        try {
          tags = JSON.parse(localStorage.tags)
        } catch (e) {
          console.log(localStorage.tags)
        }
      }
      if (tags.length > 0) {
        this.tags = tags
      } else {
        const res = await this.$axios.$get('https://alter-api/tags')
        this.tags = res.data
        localStorage.tags = this.tags
      }
      let regions = []
      if (localStorage.regions) {
        try {
          regions = JSON.parse(localStorage.regions)
        } catch (e) {
          console.log(localStorage.regions)
        }
      }
      if (regions.length > 0) {
        this.regions = regions
      } else {
        const res = await this.$axios.$get('https://alter-api/countries')
        this.regions = res.data
        localStorage.regions = this.regions
      }
    } else {
      let res = await this.$axios.$get('https://alter-api/tags')
      this.tags = res.data
      res = await this.$axios.$get('https://alter-api/countries')
      this.regions = res.data
      console.log('tags & countries loaded')
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>
  .header-menu {
      color: #fff;
      font-size: 20px;
      margin-top: 30px;
      line-height: 22px;
  }
  .header-menu li:hover {
    background-color: rgba(255, 255, 255, .90);
    border: 0px solid;
    box-shadow: 1 0 1px rgb(0, 0, 0);
    box-shadow: inset -2 0 1px rgb(255, 255, 255);
  }
  .header-menu ul li {
    text-align: center;
    float: left;
    margin: 0;
    background-color: #A2B9C8;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    height: 46px;
    padding: 4px 4px;
  }
  .region_select ul {
    display: none;
    position: absolute;
    z-index: 999;
    box-shadow: 10px 72px 72px -10px rgba(0,0,0,0.3);
    width: 350px;
    margin: 0;
    margin-top: -1px;
    margin-left: -7px;
    background: #FFF;
    color: #244255;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 1px solid #cbd6ee;
    border-top: none;
  }
  .header-menu a {
    color: #244255;
    text-decoration: none;
    list-style:none;
    font-size: 20px;
  }
  .region_select:hover ul {
    display: block;
  }
  .region_select ul li {
    margin: 0;
    font-size: 14px;
    padding: 0;
    float: none;
    text-align: left;
    line-height: 24px;
    background: none;
    height: 26px;
    text-align: left;
    padding-left: 4px;
  }
  .header-menu ul li.region_select ul li {
    height: 26px;
    text-align: left;
    padding-left: 4px;
  }
  .region_select a {
    margin: 0;
    padding: 0;
    line-height: 17px;
    overflow: hidden;
  }
    ul, li {
    list-style-type: none;
  }
  .header-menu ul li a span {
    font-size: 14px;
    display: block;
  }
  .region_select img {
    margin-bottom: -4px;
    margin-right: 5px;
  }
</style>
