<template>
    <b-row class="my-2">
        <b-col cols="4">
            {{ label }}
            {{ required ? '*' : '' }}
        </b-col>
        <b-col cols="8">
            <b-textarea
                v-if="multiline"
                v-model="val"
                class="w-100"
                @input="$emit('input', val)"
            />
            <b-input
                v-else
                v-model="val"
                class="w-100"
                :type="type"
                :required="required"
                @input="$emit('input', val)"
            />
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'TextInput',
        props: {
            label: {
                type: String,
                required: true,
            },
            value: {
                type: String,
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
        },
        emits: ['input'],
        data() {
            return {
                val: null,
            };
        },
        watch: {
            value(val) {
                this.val = val;
            },
        },
    };
</script>
