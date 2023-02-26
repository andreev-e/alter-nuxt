<template>
    <li
        :class="item.class"
    >
        <router-link :to="item.href">
            <font-awesome-icon
                v-if="item.icon"
                :icon="item.icon"
                role="button"
                class="d-md-inline d-lg-none d-xl-inline"
            />
            <div class="d-none d-md-inline-block">
                {{ item.name }}
            </div>
            <span class="d-none d-lg-block">{{ item.sub }}</span>
        </router-link>
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

</style>
