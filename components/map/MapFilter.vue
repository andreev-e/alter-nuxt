<template>
    <div class="col-sm-12 p-3">
        Отображены категории:
        <b-button
            v-for="type in types"
            :key="type"
            class="btn btn-default mr-2"
            :class="{ 'btn-light': !categories.includes(type) }"
            @click="toggle(type)"
        >
            {{ type }}
        </b-button>
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
                categories: [...TYPES],
            };
        },
        computed: {
            types() {
                return TYPES;
            },
        },
        mounted() {
            this.$emit('update', this.categories);
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
                    this.categories = [...TYPES];
                }
                this.$emit('update', this.categories);
            },
        },
    };
</script>

<style scoped>

</style>
