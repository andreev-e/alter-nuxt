<template>
    <li v-if="item">
        <nuxt-link :to="`${baseHref}/${item.url}`">
            <country-flag
                v-if="item.code"
                :country="item.code"
                size="small"
                class="d-inline-block"
            />
            <short :val="$i18n.locale === 'en' ? item.name_en : item.name" />
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
            baseHref: {
                type: String,
                required: false,
                default: '',
            },
        },
    };
</script>
