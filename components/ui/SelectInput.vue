<template>
    <b-row class="my-2">
        <b-col cols="4">
            {{ label }}
            {{ required ? '*': '' }}
        </b-col>
        <b-col cols="8">
            <b-form-select
                v-model="val"
                :required="required"
                @change="$emit('input', val)"
            >
                <b-form-select-option
                    v-for="option in options"
                    :key="option.name"
                    :value="option.name"
                >
                    {{ option.name }}
                </b-form-select-option>
            </b-form-select>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'SelectInput',
        props: {
            label: { type: String, required: true },
            value: { type: String, required: false, default: null },
            required: { type: Boolean, default: false },
            options: { type: Array, default: () => [] },
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
