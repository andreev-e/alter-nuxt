<template>
    <li
        :class="item.class"
    >
        <router-link :to="item.href">
            {{ item.name }}
            <span class="d-none d-sm-block">{{ item.sub }}</span>
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
