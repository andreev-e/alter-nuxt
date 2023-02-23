<template>
    <li v-if="item">
        <nuxt-link :to="`/region/${item.url}`">
            <country-flag
                v-if="item.code"
                :country="item.code"
                size="small"
                class="d-inline-block"
            />
            <short :val="item.name" />
            ({{ item.count }})
        </nuxt-link>
    </li>
</template>

<script>
    import Short from '../Short.vue';

    export default {
        name: 'DropDownMenuItem',
        components: { Short },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
    };
</script>
