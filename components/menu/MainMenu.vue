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
    import MainMenuItem from './MainMenuItem.vue';

    export default {
        name: 'MainMenu',
        components: { MainMenuItem },
        async fetch() {
            await this.getCountries();
            await this.getTags();
        },
        computed: {
            ...mapGetters({
                tagsLoading: 'tags/loading',
                countriesLoading: 'locations/loading',
                tags: 'tags/items',
                countries: 'locations/items',
            }),
            menuTags() {
                return [...this.tags].sort((a, b) => a.count < b.count)
                    .slice(0, 40);
            },
            menu() {
                return [
                    {
                        name: 'Страны',
                        sub: 'выбрать',
                        class: 'region_select',
                        icon: 'fa-globe',
                        submenu: {
                            menu: this.countries,
                            component: 'drop-down-menu-item',
                            baseHref: '/region',
                        },
                    },
                    {
                        name: 'Метки',
                        sub: 'выбрать',
                        class: 'region_select',
                        icon: 'fa-tags',
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
                        icon: 'fa-route',
                    },
                    {
                        name: 'Новые',
                        href: '/latest',
                        sub: 'места',
                        icon: 'fa-arrow-up',
                    },
                    {
                        name: 'Обновленные',
                        href: '/updated',
                        sub: 'публикации',
                        icon: 'fa-refresh',
                    },
                    {
                        name: 'Авторы',
                        href: '/user',
                        sub: 'участники',
                        icon: 'fa-users',
                    },
                ];
            },
            clientMenu() {
                return [
                    this.$auth.loggedIn && this.$auth.user && this.$auth.user.to_moderate ? {
                        name: 'Модерация',
                        href: '/moderation',
                        sub: `(${this.$auth.user.to_moderate}) объектов`,
                        icon: 'fa-hammer',
                    } : null,
                    {
                        name: 'Мои',
                        href: '/secure',
                        sub: 'публикации',
                        icon: 'fa-user',
                    },
                ].filter((item) => item);
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
  .header-menu li a, .header-menu li > span {
    color: #244255;
    text-decoration: none;
    font-size: 20px;
    display: block;
    padding: 4px 4px;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
  }

  @media only screen and (max-width: 992px) {
    .header-menu li a, .header-menu > ul > li {
      border-radius: 9px;
    }
    .header-menu > ul > li {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  @media only screen and (max-width: 768px) {
    .header-menu > ul > li > a, .header-menu > ul > li > span {
      font-size: 40px;
    }
    .tabs .nav-link {
      padding: 2px 4px ;
    }
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
    box-shadow: 5px 36px 36px -10px rgba(0, 0, 0, 0.9);
    width: 350px;
    margin: 0;
    margin-top: -1px;
    background: #FFF;
    color: #244255;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
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
