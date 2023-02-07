<!-- Please remove this file from your project -->
<template>
    <ul>
        <li class="region_select">
            <a href="#">
                Регион
                <b-spinner
                    v-if="countriesLoading"
                    small
                />
                <span v-else>выбрать</span>
            </a>
            <ul>
                <li
                    v-for="region in menuCountries"
                    :key="region.id"
                >
                    <nuxt-link :to="region.url">
                        <country-flag
                            v-if="region.code"
                            :country="region.code"
                            size="small"
                            class="d-inline-block"
                        />
                        {{ region.name }}
                    </nuxt-link>
                </li>
            </ul>
        </li>
        <li class="region_select">
            <a href="#">
                Метки
                <b-spinner
                    v-if="tagsLoading"
                    small
                />
                <span v-else>выбрать</span>
            </a>
            <ul>
                <li
                    v-for="tag in menuTags"
                    :key="tag.id"
                >
                    <nuxt-link :to="tag.url">
                        {{ tag.name }} ({{ tag.count }})
                    </nuxt-link>
                </li>
            </ul>
        </li>
        <li>
            <nuxt-link to="/user">
                Авторы
                <span>путеводителя</span>
            </nuxt-link>
        </li>
        <li>
            <nuxt-link to="/route">
                Маршруты
                <span>готовые треки</span>
            </nuxt-link>
        </li>
        <!--            <li>-->
        <!--                <a href="/catalog/">-->
        <!--                    Популярные-->
        <!--                    <span>в августе</span>-->
        <!--                </a>-->
        <!--            </li>-->
        <!--      <li>-->
        <!--        <a href="/catalog/?order=order">-->
        <!--          Новые-->
        <!--          <span>места</span>-->
        <!--        </a>-->
        <!--      </li>-->
        <!--      <li>-->
        <!--        <a href="/catalog/?order=order">-->
        <!--          Маршруты-->
        <!--          <span>Готовые треки</span>-->
        <!--        </a>-->
        <!--      </li>-->
        <!--      <li>-->
        <!--        <a href="/catalog/?order=order">-->
        <!--          Планирование-->
        <!--          <span>строим маршрут с точками</span>-->
        <!--        </a>-->
        <!--      </li>-->
    </ul>
</template>

<script>
  // eslint-disable-next-line no-unused-vars,import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'Menu',
        data() {
            return {};
        },
        fetch() {
            if (!this.countriesExist) {
                this.getCountries();
            }
            if (!this.tagsExist) {
                this.getTags();
            }
        },
        computed: {
            ...mapGetters({
                tagsExist: 'tags/itemsExist',
                countriesExist: 'countries/itemsExist',
                tagsLoading: 'tags/loading',
                countriesLoading: 'countries/loading',
                tags: 'tags/items',
                countries: 'countries/items',
            }),
            menuTags() {
                return this.tags.slice(0, 20);
            },
            menuCountries() {
                return this.countries;
            },
        },
        methods: {
            ...mapActions({
                getTags: 'tags/get',
                getCountries: 'countries/get',
            }),
        },
    };
</script>

<style scoped>
  .header-menu li:hover {
    background-color: rgba(255, 255, 255, .90);
    border: 0 solid;
    box-shadow: inset 0 1px rgb(255, 255, 255);
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
    margin-left: 1px;
  }

  .region_select ul {
    display: none;
    position: absolute;
    z-index: 999;
    box-shadow: 10px 72px 72px -10px rgba(0, 0, 0, 0.3);
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
    list-style: none;
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
