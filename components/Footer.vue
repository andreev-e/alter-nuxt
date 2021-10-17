<template>
  <div class="row footer">
    <div class="first_menu col-sm-4">
      <a href="/secure/">Вход для авторов</a>
      <a href="/register/">Регистрация</a>
      <a
        class="social"
        href="https://twitter.com/altertravel"
        target="_blank"
      >
        <img src="/i/tw.png" width="26" height="25" alt="Twitter"></img>
      </a>
    </div>
    <div class="copyright col-sm-4">
      2009-{{ year }} © Альтернативный путеводитель
    </div>
    <div class="second_menu col-sm-4">
      <a href="/users/">Авторы</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      year: 'year'
    }
  },
  mounted () {
    this.year = new Date().getFullYear()
  }
}
</script>

<style>
</style>
