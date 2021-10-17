<template>
  <div class="row">
    <div class="col-sm-12">
      <ul id="fastnav">
        <li><a href="#route">Как доехать?</a></li>
        <li><a href="#near">Что рядом?</a></li>
        <li><a href="#comments">Отзывы</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
    #fastnav li a {
        display: inline-block;
        border-bottom: 2px dotted #234358;
        text-decoration: none;
    }
    #fastnav li {
        display: inline-block;
        margin-right: 10px;
        font-family: "Roboto Condensed",sans-serif;
        color: #234358;
    }
    #fastnav {
        margin: 0 10px 0 0 ;
    }
</style>
