<template>
    <b-row class="my-2">
        <b-col
            md="3"
            cols="12"
            class="text-md-right text-sm-center mt-2"
        >
            {{ label }}
            {{ required ? '*' : '' }}
        </b-col>
        <b-col
            cols="12"
            md="9"
        >
            <div
                class="btn-group btn-group-toggle"
                data-toggle="buttons"
            >
                <b-button
                    v-for="variant in variants"
                    :key="variant.value"
                    class="btn"
                    :class="{ 'btn-light': val !== variant.value, 'btn-default': val === variant.value }"
                    @click="click(variant.value)"
                >
                    {{ variant.name }}
                </b-button>
            </div>
            <p
                v-if="hasError"
                :id="`${id}-error`"
                class="text-danger mt-1 text-sm"
            >
                {{ error }}
            </p>
        </b-col>
    </b-row>
</template>

<script>
    import { Form } from 'laravel-request-utils';

    export default {
        name: 'Toggler',
        props: {
            value: {
                type: [Number, Boolean, String],
                required: true,
            },
            variants: {
                type: Array,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
            form: { type: Form, default: undefined },
            id: { type: String, required: true },
        },
        emits: ['input'],
        data() {
            return {
                val: null,
            };
        },
        computed: {
            hasError() {
                return typeof this.form !== 'undefined' ? this.form.errors.has(this.id) : false;
            },
            error() {
                return typeof this.form !== 'undefined' ? this.form.errors.get(this.id) : '';
            },
        },
        watch: {
            value(val) {
                this.val = val;
            },
        },
        mounted() {
            this.val = this.value;
        },
        methods: {
            click(val) {
                this.$emit('input', val);
                this.val = val;
            },
        },
    };
</script>

<style scoped>

</style>
