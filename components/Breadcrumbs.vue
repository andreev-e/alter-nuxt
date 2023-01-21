<template>
  <div class="content row">
    <div class="navigation col-12">
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
          v-for="(crumb, index) in crumbs"
          :key="crumb.id"
        >
          <router-link v-if="crumb.url" :to="crumb.url" @click.native="pop(index)">
            {{ crumb.name }}
          </router-link>
          <span v-else>
            {{ crumb.name }}
          </span>
        </li>
        <li v-if="loading">
          <span>
            <b-spinner small />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    list: {
      type: Array,
      required: false,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      crumbs: []
    }
  },
  watch: {
    list: {
      handler (val) {
        localStorage.breadcrumbs = JSON.stringify(val)
        this.crumbs = val
      }
    }
  },
  created () {
    if (process.client) {
      if (localStorage.breadcrumbs) {
        try {
          this.crumbs = JSON.parse(localStorage.breadcrumbs)
        } catch (e) {
          return []
        }
      } else {
        localStorage.breadcrumbs = JSON.stringify(this.list)
        this.crumbs = this.list
      }
    } else {
      this.crumbs = this.list
    }
  },
  methods: {
    pop (index) {
      for (let i = 0; i < (this.crumbs.length - index); i++) {
        this.crumbs.pop()
      }
      localStorage.breadcrumbs = JSON.stringify(this.crumbs)
    }
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
