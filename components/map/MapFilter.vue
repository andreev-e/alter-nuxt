<template>
    <div class="col-sm-12 p-2 text-center">
        <template v-if="expanded || !expandable">
            <b-button
                v-for="type in types"
                :key="type.name"
                class="btn btn-default mr-1 mb-1"
                :class="{ 'btn-light': !categories.includes(type.name) }"
                @click="toggle(type.name)"
            >
                <font-awesome-icon
                    v-if="categories.includes(type.name)"
                    :icon="paramCase(type.icon)"
                    class="mr-2"
                    :style="{ color: type.color, height: '18px' }"
                />
                {{ type.name }}
            </b-button>
            <span
                v-if="expandable"
                class="expander"
                @click="expanded = !expanded"
            ><br>Скрыть фильтры карты</span>
        </template>
        <span
            v-if="expandable && !expanded"
            class="expander"
            @click="expanded = !expanded"
        >Показать фильтры карты</span>
    </div>
</template>

<script>
    import { TYPES } from '../../constants';

    export default {
        name: 'MapFilter',
        props: {
            model: {
                type: Object,
                default: () => {
                },
            },
        },
        emits: ['update'],
        data() {
            return {
                categories: [...TYPES].map((t) => t.name),
                expanded: false,
                expandable: true,
            };
        },
        computed: {
            types() {
                return TYPES;
            },
        },
        mounted() {
            this.expandable = window.innerWidth < 992;
            this.$emit('update', [...this.categories]);
        },
        methods: {
            toggle(type) {
                let deleted = false;
                for (let i = 0; i < this.categories.length; i += 1) {
                    if (this.categories[i] === type) {
                        deleted = true;
                        this.categories.splice(i, 1);
                    }
                }
                if (!deleted) {
                    this.categories.push(type);
                }
                if (this.categories.length === 0) {
                    this.categories = [...TYPES].map((t) => t.name);
                }
                this.$emit('update', [...this.categories]);
            },
            paramCase(str) {
                if (str) {
                    return str
                        .replace(/\B([A-Z])/gu, '-$1')
                        .toLowerCase();
                }
                return str;
            },
        },
    };
</script>

<style scoped>
  .expander {
    font-size: 16px;
    line-height: 18px;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px dotted #244255;
  }
</style>
