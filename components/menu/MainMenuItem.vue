<template>
    <li
        :class="item.class"
    >
        <router-link
            v-if="item.href"
            :to="item.href"
        >
            <font-awesome-icon
                v-if="item.icon"
                :icon="item.icon"
                role="button"
                class="menu-icon d-md-inline d-lg-none d-xl-inline"
            />
            <div class="d-none d-md-inline-block">
                {{ item.name }}
            </div>
            <span class="d-none d-lg-block">{{ item.sub }}</span>
        </router-link>
        <span v-else>
            <font-awesome-icon
                v-if="item.icon"
                :icon="item.icon"
                role="button"
                class="menu-icon d-md-inline d-lg-none d-xl-inline"
            />
            <div class="d-none d-md-inline-block">
                {{ item.name }}
            </div>
            <span class="d-none d-lg-block">{{ item.sub }}</span>
        </span>
        <ul v-if="item.submenu">
            <component
                :is="item.submenu.component"
                v-for="subMenuItem in item.submenu.menu"
                :key="subMenuItem.name"
                :item="subMenuItem"
                :base-href="item.submenu.baseHref"
            />
        </ul>
    </li>
</template>

<script>
    import DropDownMenuItem from './DropDownMenuItem.vue';

    export default {
        name: 'MainMenuItem',
        components: { DropDownMenuItem },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
    };
</script>

<style scoped>
  .menu-icon {
    max-height: 30px;
  }
</style>
