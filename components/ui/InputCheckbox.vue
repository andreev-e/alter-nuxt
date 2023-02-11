<template>
    <label
        :for="id"
        :class="$attrs.class"
        class="d-flex items-center font-light text-gray-700 space-x-2"
    >
        <input
            :id="id"
            v-model="model"
            type="checkbox"
            class="form-checkbox h-4 w-4"
        >
        <div>
            <div>{{ label }}</div>
            <div
                v-if="description"
                class="text-xs text-gray-500"
            >
                {{ description }}
            </div>
        </div>
    </label>
</template>

<script>
    export default {
        name: 'InputCheckbox',
        inheritAttrs: false,
        props: {
            id: { type: String, required: true },
            label: { type: String, default: '' },
            modelValue: { type: [String, Number, Boolean], required: true },
            description: { type: String, default: '', required: false },
        },
        emits: ['update'],
        computed: {
            model: {
                get() {
                    return this.modelValue;
                },
                set(value) {
                    this.$emit('update', value);
                },
            },
        },
    };
</script>
