<!-- Please remove this file from your project -->
<template>
    <ul>
        <main-menu-item
            v-for="item in menu"
            :key="item.name"
            :item="item"
        />
        <client-only v-if="$auth.loggedIn">
            <main-menu-item
                v-for="item in clientMenu"
                :key="item.name"
                :item="item"
            />
        </client-only>
    </ul>
</template>

<script>
  // eslint-disable-next-line no-unused-vars,import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import MainMenuItem from './menu/MainMenuItem.vue';

    export default {
        name: 'Menu',
        components: { MainMenuItem },
        data() {
            return {};
        },
        async fetch() {
            if (!this.countriesExist) {
                await this.getCountries();
            }
            if (!this.tagsExist) {
                await this.getTags();
            }
        },
        computed: {
            ...mapGetters({
                tagsExist: 'tags/itemsExist',
                countriesExist: 'locations/itemsExist',
                tagsLoading: 'tags/loading',
                countriesLoading: 'locations/loading',
                tags: 'tags/items',
                countries: 'locations/items',
            }),
            menuTags() {
                return [...this.tags].sort((a, b) => a.count < b.count)
                    .slice(0, 20);
            },
            menu() {
                return [
                    {
                        name: 'Регионы',
                        href: '/#',
                        sub: 'выбрать',
                        class: 'region_select',
                        submenu: {
                            menu: this.countries,
                            component: 'drop-down-menu-item',
                            baseHref: '/region',
                        },
                    },
                    {
                        name: 'Метки',
                        href: '/#',
                        sub: 'выбрать',
                        class: 'region_select',
                        submenu: {
                            menu: this.menuTags,
                            component: 'drop-down-menu-item',
                            baseHref: '/tag',
                        },
                    },
                    {
                        name: 'Маршруты',
                        href: '/route',
                        sub: 'готовые треки',
                    },
                    {
                        name: 'Авторы',
                        href: '/user',
                        sub: 'путеводителя',
                    },
                    {
                        name: 'Новые',
                        href: '/latest',
                        sub: 'места',
                    },
                    {
                        name: 'Последние',
                        href: '/updated',
                        sub: 'обновления',
                    },
                ];
            },
            clientMenu() {
                return [
                    this.$auth.user.username === 'andreev' ? {
                        name: 'Модерация',
                        href: '/moderation',
                        sub: 'объектов',
                    } : null,
                    {
                        name: 'Мои',
                        href: '/secure',
                        sub: 'публикации',
                    },
                ];
            },
        },
        methods: {
            ...mapActions({
                getTags: 'tags/get',
                getCountries: 'locations/get',
            }),
        },
    };
</script>

<style>
  .header-menu li a {
    color: #244255;
    text-decoration: none;
    font-size: 20px;
    display: block;
    padding: 4px 4px;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
  }

  .header-menu li a:hover, .header-menu li a.nuxt-link-exact-active {
    background-color: #fff;
    border: 0 solid;
    box-shadow: inset 0 1px rgb(255, 255, 255);
  }

  .header-menu > ul > li {
    text-align: center;
    float: left;
    background-color: #A2B9C8;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    margin-left: 1px;
  }

  .region_select > ul {
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
    padding-left: 4px;
  }

  .header-menu ul li a span {
    font-size: 14px;
    display: block;
  }

</style>
