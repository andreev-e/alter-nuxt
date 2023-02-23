<template>
    <label
        :for="id"
        class="btn btn-sm  d-flex items-center font-light text-gray-700 mr-2"
        :class="{ 'btn-success' : model, 'btn-light':!model }"
    >
        <input
            :id="id"
            v-model="model"
            type="checkbox"
            class="form-checkbox h-4 w-4"
        >
        <div>
            <div
                class=""
                style="font-size: 18px;"
            >{{ label }}
            </div>
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
            id: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                default: '',
            },
            modelValue: {
                type: [String, Number, Boolean],
                required: true,
            },
            description: {
                type: String,
                default: '',
                required: false,
            },
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
