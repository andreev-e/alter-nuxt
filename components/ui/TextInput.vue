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
            <el-input
                v-model="val"
                class="w-100"
                :type="type"
                @input="$emit('input', val)"
            />
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
        name: 'TextInput',
        props: {
            label: {
                type: String,
                required: true,
            },
            value: {
                type: [String, Number],
                required: false,
                default: null,
            },
            type: {
                type: String,
                default: 'text',
            },
            multiline: {
                type: Boolean,
                default: false,
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
    };
</script>
