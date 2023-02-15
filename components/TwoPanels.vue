<template>
    <b-row>
        <b-col v-if="left.length">
            <b>Выберите регион {{ tag.NAME_ROD_ED }}</b>
            <ul class="additional_cities">
                <li
                    v-for="child in dataLeft"
                    :key="child.id"
                >
                    <nuxt-link :to="child.url">
                        <short :val="child.name" />
                    </nuxt-link>
                </li>
                <li
                    v-if="left.length > limit"
                    class="more"
                    @click="limitedLeft = !limitedLeft"
                >
                    {{ limitedLeft ? 'Показать все' : 'Свернуть' }}
                </li>
            </ul>
        </b-col>
        <b-col v-if="right.length">
            <b>Объекты {{ tag.NAME_ROD_ED }} по видам</b>
            <ul class="pravaya_kolonka">
                <li
                    v-for="child in dataRight"
                    :key="child.id"
                >
                    <nuxt-link :to="`${urlPrefix}/${child.url}`">
                        {{ child.NAME_ROD ? child.NAME_ROD : child.name }}
                    </nuxt-link>
                </li>
                <li
                    v-if="right.length > limit"
                    class="more"
                    @click="limitedRight = !limitedRight"
                >
                    {{ limitedRight ? 'Показать все' : 'Свернуть' }}
                </li>
            </ul>
        </b-col>
    </b-row>
</template>

<script>
    import Short from './Short.vue';

    export default {
        name: 'TwoPanels',
        components: { Short },
        props: {
            left: {
                type: Array,
                required: false,
                default: () => [],
            },
            right: {
                type: Array,
                required: false,
                default: () => [],
            },
            tag: {
                type: [Boolean, Object],
                default: false,
            },
        },
        data() {
            return {
                limit: 7,
                limitedLeft: true,
                limitedRight: true,
            };
        },
        computed: {
            urlPrefix() {
                if (this.tag) {
                    return `/region/${this.tag.url}`;
                }
                return '';
            },
            dataLeft() {
                if (this.limitedLeft) {
                    return [...this.left].splice(0, this.limit);
                }
                return this.left;
            },
            dataRight() {
                if (this.limitedRight) {
                    return [...this.right].splice(0, this.limit);
                }
                return this.right;
            },
        },
    };
</script>

<style>
  .additional_cities li a, .additional_cities_more li a, .pravaya_kolonka li a, .pravaya_kolonka_more li a {
      color: #FFF;
      text-decoration: none;
  }
  .additional_cities li, .additional_cities_more li, .pravaya_kolonka li, .pravaya_kolonka_more li {
    background: #7495AA;
    color: #fff;
    float: left;
    border: 1px solid #7495AA;
    border-radius: 3px;
    margin-right: 3px;
    margin-bottom: 3px;
    padding: 1px 3px;
    cursor: pointer;
    font-size:18px;
  }
  li.more {
    background: #343a40;
  }
</style>
