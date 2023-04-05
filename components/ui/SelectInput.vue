<template>
    <b-row class="my-2">
        <b-col
            md="3"
            cols="12"
            class="text-md-right text-sm-center mt-2"
        >
            {{ label }}
            {{ required ? '*': '' }}
        </b-col>
        <b-col
            cols="12"
            md="9"
        >
            <el-select
                v-model="val"
                :required="required"
                @change="$emit('input', val)"
            >
                <el-option
                    v-for="option in options"
                    :key="option.name"
                    :value="option.id"
                    :label="option.name"
                />
            </el-select>
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
