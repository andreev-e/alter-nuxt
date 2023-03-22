<template>
    <b-row>
        <b-col v-if="left.length">
            <b>{{ $t('TWO_PANELS.SELECT_REGION') }} {{ tag.NAME_ROD_ED }}</b>
            <ul class="additional_cities">
                <li
                    v-for="child in dataLeft"
                    :key="child.id"
                >
                    <nuxt-link :to="child.url">
                        <short
                            :val="$i18n.locale === 'en' && child.name_en ? child.name_en : child.name"
                        />
                    </nuxt-link>
                </li>
                <li
                    v-if="left.length > limitLeft"
                    class="more"
                    @click="limitedLeft = !limitedLeft"
                >
                    {{ limitedLeft ? $t('UI.DISPLAY_ALL') : $t('UI.HIDE') }}
                </li>
            </ul>
        </b-col>
        <b-col v-if="right.length">
            <b>{{ $t('TWO_PANELS.POINTS') }} {{ tag.NAME_ROD_ED }} {{ $t('TWO_PANELS.BY_TYPE') }}</b>
            <ul class="pravaya_kolonka">
                <li
                    v-for="child in dataRight"
                    :key="child.id"
                >
                    <nuxt-link :to="`${urlPrefix}/${child.url}`">
                        <template v-if="$i18n.locale === 'en'">
                            {{ child.name_en }}
                        </template>
                        <template v-else>
                            {{ child.NAME_ROD ? child.NAME_ROD : child.name }}
                        </template>
                    </nuxt-link>
                </li>
                <li
                    v-if="right.length > limitRight"
                    class="more"
                    @click="limitedRight = !limitedRight"
                >
                    {{ limitedRight ? $t('UI.DISPLAY_ALL') : $t('UI.HIDE') }}
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
                limitedLeft: true,
                limitedRight: true,
                lineLength: 60,
            };
        },
        computed: {
            limitLeft() {
                let sum = 0;
                for (let i = 0; i < this.left.length; i += 1) {
                    sum += this.left[i].name.length;
                    if (sum > this.lineLength) {
                        return i;
                    }
                }
                return 7;
            },
            limitRight() {
                let sum = 0;
                for (let i = 0; i < this.right.length; i += 1) {
                    sum += this.right[i].name.length;
                    if (sum > this.lineLength) {
                        return i;
                    }
                }
                return 7;
            },
            urlPrefix() {
                if (this.tag) {
                    return `/region/${this.tag.url}`;
                }
                return '';
            },
            dataLeft() {
                if (this.limitedLeft) {
                    return [...this.left].splice(0, this.limitLeft);
                }
                return this.left;
            },
            dataRight() {
                if (this.limitedRight) {
                    return [...this.right].splice(0, this.limitRight);
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
    font-size: 18px;
  }

  li.more {
    background: #343a40;
  }
</style>
