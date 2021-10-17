<template>
  <div class="container page">
    <Header />
    <Breadcrumbs :list="poi.locations" />
    <div class="row">
      <div class="col-sm-12">
        <h1 class="view">
          {{ poi.name }}
        </h1>
      </div>
    </div>
    <Fastnav />
    <div class="row inner">
      <div class="col-sm-8 object-full">
        <div class="near">
          <ul class="tabs">
            <li id="link_photo" class="taba1 active">
              <a href="#" onclick="return vkladka1('_photo');">
                <img src="https://altertravel.ru/i/altertravel.png"> Фото
              </a>
            </li>
            <li id="link_map" class="taba1 ">
              <a href="#" onclick="return vkladka1('_map');">
                <img src="https://altertravel.ru/i/map.png"> Где находится?
              </a>
            </li>
            <li id="link_ytb" class="taba1">
              <a href="#" onclick="return vkladka1('_ytb');">
                <img src="https://altertravel.ru/i/youtube.png"> Youtube
              </a>
            </li>
          </ul>
          <ul class="pages">
            <li id="vkladka_photo" class="vkladka1 active">
              <div class="view_image">
                <div id="bigimage">
                  <img :src="'https://altertravel.ru/full.php?f=/images/' + $route.params.id + '.jpg'" :title="poi.name" class="img-fluid">
                </div>
                <div id="thumbs">
                  <div v-for="i in 3" :key="i" class="gal-img">
                    <a :href="'https://altertravel.ru/full.php?f=/images/' + $route.params.id + '/' + i + '.jpg'" class="lightbox cboxElement">
                      <img :src="'https://altertravel.ru/thumb.php?f=/images/' + $route.params.id + '/' + i + '.jpg'" :alt="poi.name" class="img-fluid">
                    </a>
                  </div>
                </div>
                <p><a href="https://altertravel.ru/show_user.php?name=olegoo">автор</a> © Все права на опубликованные фотографии и видео принадлежат их авторам</p>
              </div>
            </li>
            <li id="vkladka_map" class="vkladka1">
              <div id="map_guide" />
              <h2 id="coord">
                Кординаты
              </h2>
              <div class="coords plusplus_sl">
                <div class="qr">
                  <img src="https://altertravel.ru/qr.php?lng=43.455948&amp;lat=43.123161" alt="QR code">
                </div>
                <div class="points">
                  <span>43.123161,&nbsp;43.455948</span>
                  <a href="https://altertravel.ru/generate_kml.php?id=22728">
                    <div class="dwnl-kml">
                      <span>скачать KML файл</span>
                    </div>
                  </a>
                </div>
              </div>
            </li>
            <li id="vkladka_ytb" class="vkladka1">
              <iframe width="700" height="400" src="https://www.youtube.com/embed/FtqJY_QH5Xw" frameborder="0" allowfullscreen="" />
            </li>
          </ul>
        </div>
      </div>
      <div class="col-sm-4">
        <h2 id="interesting">
          Описание
        </h2>
        <p>
          {{ poi.description }}
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <h2 id="near">
          Что еще есть рядом с эти местом
        </h2>
        <div class="near">
          <b-tabs content-class="mt-3">
            <b-tab title="Ближе всего" active>
              <p>Контент</p>
            </b-tab>
            <b-tab
              v-for="tag in poi.tags"
              :key="tag.ID"
              :title="tag.NAME_ROD + '(' + tag.COUNT + ')'"
            >
              <p>Контент</p>
            </b-tab>
            <b-tab title="«Техноген»">
              <p>Контент</p>
            </b-tab>
            <b-tab title="Ночлег">
              <p>Контент</p>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <h2 v-if="poi.route" id="route">
          Как добраться на машине
        </h2>
        <p>{{ poi.route }}</p>
      </div>
      <div class="col-sm-6">
        <h2 v-if="poi.route_o" id="route_o">
          Как добраться на общественном транспорте
        </h2>
        <p>{{ poi.route_o }}</p>
      </div>
      <div class="col-sm-12">
        <h2 v-if="poi.addon" id="addon">
          Примечание
        </h2>
        <p>{{ poi.addon }}</p>
        <a class="button btn" href="/izbrannoe.php" onclick="izbrannoe(1331)">Построить маршрут с данной точкой</a>
        <a id="geo" class="button btn" href="google.navigation:q=55.673737,37.700745">Навигация на точку</a>
      </div>
    </div>
    <Comments :id="$route.params.id" type="poi" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      poi: {}
    }
  },
  async fetch () {
    await this.fetchPoi()
  },
  head () {
    return {
      title: this.poi.name,
      meta: [
        {
          name: 'description',
          content: 'todo'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    async fetchPoi () {
      const result = await this.$axios.$get(
        'https://alter-api/pois/' + this.$route.params.id
      )
      this.poi = result.data
    }
  }
}
</script>

<style scoped>
  .near, .comments_tabz {
    background: #7495AA;
    padding: 5px;
    border-radius: 3px;
    margin-bottom: 5px;
    overflow: hidden;
  }
  ul.tabs li.taba.active a, ul.tabs li.taba1.active a, ul.tabs li.taba.active, ul.tabs li.taba1.active, ul.tabs li.taba_c.active a, ul.tabs li.taba_c.active {
    color: #7495AA;
  }
  ul.tabs li.active {
    background: #eee;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }
  ul.tabs li.taba a, ul.tabs li.taba1 a, ul.tabs li.taba, ul.tabs li.taba1, ul.tabs li.taba_c a, ul.tabs li.taba_c {
    color: #FFF;
    line-height: 35px;
    height: 42px;
    display: inline-block;
  }
  ul.tabs img {
    display: inline-block;
    vertical-align: middle;
    border-radius: 4px;
  }
  ul.pages {
    background: #FFF;
  }
  li.vkladka, li.vkladka_c, li.vkladka1 {
    display: none;
  }
  li.vkladka.active, li.vkladka1.active, li.vkladka_c.active {
    display: block;
  }
  ul.pages > li {
    background: #eee;
    box-shadow: 2px 2px 5px 0px rgb(50 50 50 / 50%);
  }
  .view_image #bigimage {
    width: 80%;
    float: left;
  }
  .view_image #bigimage img {
    width: 90%;
    margin: auto;
  }
  #vkladka_photo #thumbs {
    float: left;
    width: 20%;
  }
  .gal-img {
    position: relative;
    margin-bottom: 12px;
    text-align: center;
    max-width: 150px;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
