<template>
  <div class="container page">
    <Header />
    <div class="row">
      <div class="col-sm-12">
        <h1>
          {{ $route.params.id }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Карта достопримечательностей для самостоятельных путешественников',
    meta: [
      {
        name: 'description',
        content: 'Каталог достопримечательностей на карте . Для самостоятельной организации путешествия!'
      }
    ]
  }
}
</script>
